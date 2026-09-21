// Renders the art for Lane One: the mark, the avatar, the banner and the link
// preview.
//
//   npm run render
//
// It reads two files. `../token.json` is the launch — the same file Toollpad's
// `npm run launch` sends — and `../launchpad.json` is the rate the pool will
// charge. In Toollpad's own repository that rate is read out of the contract
// source and the render fails if the copy disagrees with it. Here there is no
// contract source to read, so the figures are copied, and `launchpad.json`
// records the commit they were copied from. The check that matters happens on
// the page instead: it reads the live rate off the chain, and a figure that has
// drifted shows up there rather than being asserted here.
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

import { markSvg } from "./art.mjs";
import { FACES, FONT_CSS, PALETTE } from "./lib/palette.mjs";
import { readRates } from "./lib/rates.mjs";
import { ethPerTokenFromSqrtPrice, launchRange, pricePerToken } from "./lib/ticks.mjs";
import { inlineFonts, shoot } from "./lib/sheets.mjs";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const here = dirname(fileURLToPath(import.meta.url));
const root = dirname(here);

const token = JSON.parse(readFileSync(join(root, "token.json"), "utf8"));
const RATE = readRates(join(root, "launchpad.json"));
const LAUNCHPAD = { ...JSON.parse(readFileSync(join(root, "launchpad.json"), "utf8")).deployed, deployer: "0xDD6eC911F99C5C468632570e028023B875065453" };
const FONTS = await inlineFonts(FONT_CSS);

const CHAIN = "ROBINHOOD CHAIN 4663";
const VENUE = "UNISWAP V4";

/**
 * The words on the art, in the language the account is in.
 *
 * A token's account is in one language and stays in it — a banner in English
 * over a feed in Indonesian reads like a banner somebody else made. So the
 * language is a field on the token rather than a property of this file, and the
 * figures beside these words come from the contracts either way.
 */
const COPY = {
  en: {
    sign: "LAUNCH",
    opening: "Opening tick",
    supply: "Supply",
    intoPool: "Into the pool",
    allOfIt: "All of it",
    toll: "Toll",
    tollValue: (rate) => `${rate.toll} · ${rate.creator} to the creator`,
    bothWays: "both ways",
    split: "Split",
    splitValue: (rate) => `${rate.creator} creator, ${rate.treasury} treasury`,
    poolFee: "Pool fee",
    zero: "Zero",
    liquidity: "Liquidity",
    locked: "Locked, permanently",
    heldBack: "Held back",
    nothing: "None of it",
    strip: (rate) => [`${rate.toll} EACH WAY`, `${rate.creator} TO THE CREATOR`, "POOL LOCKED"],
    exit: "EXIT",
    ahead: "LANE OPEN",
  },
  id: {
    sign: "LAUNCH",
    opening: "Tick pembukaan",
    supply: "Supply",
    intoPool: "Masuk ke pool",
    allOfIt: "Semuanya",
    toll: "Toll",
    tollValue: (rate) => `${rate.toll} · ${rate.creator} buat creator`,
    bothWays: "dua arah",
    split: "Bagian",
    splitValue: (rate) => `${rate.creator} creator, ${rate.treasury} treasury`,
    poolFee: "Fee pool",
    zero: "Nol",
    liquidity: "Likuiditas",
    locked: "Dikunci, permanen",
    heldBack: "Ditahan",
    nothing: "Tidak ada",
    strip: (rate) => [`${rate.toll} DUA ARAH`, `${rate.creator} BUAT CREATOR`, "POOL DIKUNCI"],
    exit: "EXIT",
    ahead: "LAJUR DIBUKA",
  },
};

const wordsFor = (token) => {
  const language = token.profile?.language ?? "en";
  const words = COPY[language];
  if (!words) throw new Error(`${token.slug ?? token.symbol}: no art copy written in "${language}"`);
  return words;
};

/**
 * Where the pool actually opens, run through the same tick math the launch runs.
 *
 * A launch asks for a valuation and gets the nearest tick on the grid, which is
 * never quite the number asked for — and rounds towards a dearer token, so the
 * sale never starts below the floor. The card prints what the pool will open at
 * rather than what was typed into `token.json`, because the first is a fact
 * about the transaction and the second is an intention.
 */
function openingValuation(token) {
  const whole = RATE.supplyWei / 10n ** 18n;
  const range = launchRange({
    floorEthPerToken: pricePerToken(token.launch.openingEth, whole),
    ceilEthPerToken: pricePerToken(token.launch.ceilingEth, whole),
    tickSpacing: token.launch.tickSpacing ?? 200,
  });

  const perToken = Number(ethPerTokenFromSqrtPrice(range.sqrtPriceX96)) / 1e18;
  const eth = (perToken * Number(whole)).toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
  return { eth, tick: range.currentTick };
}

/**
 * Nothing that is not yet somebody's goes onto an image.
 *
 * The launchpad's own rule, applied to tokens: no handle and no domain on any
 * art. X shows both in its own chrome, an image repeating them is one more thing
 * that can go stale, and a handle printed before it is registered is an
 * invitation to whoever registers it next. This is checked rather than
 * remembered — see brand/X-PROFILE.md for the incident that made it a rule.
 */
function refuseIdentityOnArt(name, html, handle) {
  // What a reader sees, which is what the rule is about: the inlined fonts, the
  // stylesheet and every tag come out first. Markup carries domains of its own —
  // an SVG names `w3.org` in its xmlns — and none of them are printed.
  const art = html
    .split(FONTS)
    .join("")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ");

  // Any domain, rather than a list of the ones thought of in advance. The list
  // used to name six endings, and this project's own is `.lol`, which was not
  // one of them — a rule that catches only what someone remembered is the rule
  // that let TOOLLPAD.FUN onto a card. Decimals are safe: digits after the dot
  // do not match, so 1.7234 is a number and laneone.lol is a domain.
  const found = [handle, ...(art.match(/\b[a-z][a-z0-9-]+\.[a-z]{2,24}\b/gi) ?? [])].filter(
    (needle) => needle && art.includes(needle),
  );
  if (found.length > 0) {
    throw new Error(`${name}: art must not print a handle or a domain — found ${[...new Set(found)].join(", ")}`);
  }
}

const BASE = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: "Overpass", system-ui, sans-serif; color: ${PALETTE.marking}; }

  /* The road the signs stand over: asphalt, with the tooth of worn tarmac. */
  .road {
    background-color: ${PALETTE.asphalt};
    background-image:
      radial-gradient(rgb(255 255 255 / .045) .6px, transparent .6px),
      radial-gradient(rgb(0 0 0 / .25) .6px, transparent .6px);
    background-size: 11px 11px, 17px 17px;
    background-position: 0 0, 5px 7px;
  }

  /* A guide sign: green panel, rounded, with the white border set in from the
     edge — the detail that makes a green rectangle read as signage. */
  .sign {
    background: ${PALETTE.sign};
    border-radius: 14px;
    padding: 7px;
  }
  .sign > .inner { border: 3px solid ${PALETTE.marking}; border-radius: 8px; height: 100%; }

  .lane-rule {
    height: 10px;
    background-image: linear-gradient(90deg, ${PALETTE.marking} 0 58px, transparent 58px 96px);
    background-size: 96px 10px;
  }

  .label { font-family: "Overpass Mono", monospace; font-size: 13px; letter-spacing: .16em; text-transform: uppercase; color: ${PALETTE.markingDim}; }
  .figure { font-family: "Overpass Mono", monospace; font-weight: 600; }
  .display { font-weight: 800; letter-spacing: -.02em; }

  .row { display: flex; justify-content: space-between; align-items: baseline; gap: 20px; padding: 9px 20px; border-bottom: 1px solid rgb(247 250 247 / .22); }
  .row:last-child { border-bottom: 0; }
  .row span { font-family: "Overpass Mono", monospace; font-size: 14px; letter-spacing: .04em; color: ${PALETTE.markingDim}; }
  .row b { font-family: "Overpass Mono", monospace; font-size: 15px; font-weight: 600; color: ${PALETTE.marking}; }

  /* The exit-number badge every guide sign carries in its top corner. */
  .exit {
    background: ${PALETTE.orange}; color: ${PALETTE.asphaltDeep};
    border-radius: 8px; padding: 6px 12px;
    font-family: "Overpass Mono", monospace; font-weight: 600; font-size: 13px; letter-spacing: .12em;
  }
`;

/** The launch, as the rows of a guide sign. Every line is true a year later. */
const signRows = (token, words) => `
  <div class="row"><span>${words.opening}</span><b>${openingValuation(token).eth} ETH</b></div>
  <div class="row"><span>${words.supply}</span><b>${RATE.supply}</b></div>
  <div class="row"><span>${words.intoPool}</span><b>${words.allOfIt}</b></div>
  <div class="row"><span>${words.toll}</span><b>${words.tollValue(RATE)}</b></div>
  <div class="row"><span>${words.liquidity}</span><b>${words.locked}</b></div>`;

const bannerSheet = (token, mark) => {
  const words = wordsFor(token);
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${BASE}
  body { width: 1500px; height: 500px; overflow: hidden; }
  .sheet { width: 1500px; height: 500px; display: flex; flex-direction: column; }
</style></head><body>
  <div class="sheet road">
    <div style="flex:1;display:flex;align-items:center;gap:46px;padding:0 58px">
      <div class="sign" style="flex:0 0 auto">
        <div class="inner" style="padding:18px">${mark(132)}</div>
      </div>

      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:14px">
          <h1 class="display" style="font-size:78px;line-height:.95;color:${PALETTE.marking}">${token.name}</h1>
          <span class="exit">$${token.symbol}</span>
        </div>
        <div class="label" style="margin-top:14px">${VENUE} &middot; ${CHAIN}</div>
        <div style="margin-top:14px;font-size:19px;line-height:1.5;color:${PALETTE.markingDim};max-width:520px">${token.blurb}</div>
      </div>

      <div class="sign" style="flex:0 0 auto;width:430px">
        <div class="inner">
          <div style="display:flex;justify-content:space-between;align-items:center;padding:11px 20px 9px">
            <span class="label" style="color:${PALETTE.marking};font-weight:600">${words.sign}</span>
            <span class="label" style="color:${PALETTE.marking}">${words.ahead}</span>
          </div>
          <div style="border-top:1px solid rgb(247 250 247 / .35)">${signRows(token, words)}</div>
        </div>
      </div>
    </div>

    <div class="lane-rule"></div>
    <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 58px;background:${PALETTE.asphaltDeep}">
      ${words.strip(RATE).map((line) => `<span class="label" style="color:${PALETTE.marking}">${line}</span>`).join("")}
    </div>
  </div>
</body></html>`;
};

const ogSheet = (token, mark) => {
  const words = wordsFor(token);
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${BASE}
  body { width: 1200px; height: 630px; overflow: hidden; }
  .frame { width: 1200px; height: 630px; padding: 40px; display: flex; flex-direction: column; gap: 20px; }
</style></head><body>
  <div class="frame road">
    <div class="sign" style="flex:1;min-height:0">
      <div class="inner" style="display:flex;flex-direction:column;padding:30px 34px">
        <div style="display:flex;align-items:center;gap:24px">
          <div style="flex:0 0 auto">${mark(120)}</div>
          <div style="flex:1;min-width:0">
            <h1 class="display" style="font-size:72px;line-height:.95;color:${PALETTE.marking}">${token.name}</h1>
            <div class="label" style="margin-top:10px;color:${PALETTE.marking}">$${token.symbol} &middot; ${VENUE}</div>
          </div>
          <span class="exit" style="font-size:22px;padding:12px 18px">${RATE.toll}</span>
        </div>

        <p style="margin-top:22px;font-size:22px;line-height:1.45;color:${PALETTE.markingDim}">${token.blurb}</p>

        <div style="margin-top:auto;border-top:1px solid rgb(247 250 247 / .35)">${signRows(token, words)}</div>
      </div>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center">
      ${words.strip(RATE).map((line) => `<span class="label" style="color:${PALETTE.markingDim}">${line}</span>`).join("")}
    </div>
  </div>
</body></html>`;
};

/**
 * The card a launch post carries.
 *
 * Every line on it is a fact about one transaction, and stays true a year
 * later: the opening tick is where the pool was initialised and the rest are
 * constants in the contracts. No price, no market cap, no holder count — those
 * move, and an image cannot.
 */
const launchCard = (token, mark) => {
  const words = wordsFor(token);
  return `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${BASE}
  body { width: 1600px; height: 900px; overflow: hidden; }
  .frame { width: 1600px; height: 900px; padding: 46px; display: flex; flex-direction: column; gap: 22px; }
  .big span { font-size: 22px; }
  .big b { font-size: 26px; }
  .big { padding: 15px 26px; }
</style></head><body>
  <div class="frame road">
    <div class="sign" style="flex:1;min-height:0">
      <div class="inner" style="display:flex;flex-direction:column;padding:34px 40px">
        <div style="display:flex;align-items:center;gap:30px">
          <div style="flex:0 0 auto">${mark(148)}</div>
          <div style="flex:1;min-width:0">
            <h1 class="display" style="font-size:94px;line-height:.92;color:${PALETTE.marking}">${token.name}</h1>
            <div class="label" style="margin-top:12px;font-size:16px;color:${PALETTE.marking}">$${token.symbol} &middot; ${VENUE} &middot; ${CHAIN}</div>
          </div>
          <span class="exit" style="font-size:30px;padding:14px 22px">${RATE.toll}</span>
        </div>

        <div style="margin-top:24px;flex:1;min-height:0;display:flex;flex-direction:column;justify-content:space-between;border-top:1px solid rgb(247 250 247 / .35)">
          <div class="row big"><span>${words.opening}</span><b>${openingValuation(token).eth} ETH</b></div>
          <div class="row big"><span>${words.supply}</span><b>${RATE.supply}</b></div>
          <div class="row big"><span>${words.intoPool}</span><b>${words.allOfIt}</b></div>
          <div class="row big"><span>${words.toll}</span><b>${RATE.toll} &middot; ${words.bothWays}</b></div>
          <div class="row big"><span>${words.split}</span><b>${words.splitValue(RATE)}</b></div>
          <div class="row big"><span>${words.poolFee}</span><b>${words.zero}</b></div>
          <div class="row big"><span>${words.liquidity}</span><b>${words.locked}</b></div>
          <div class="row big"><span>${words.heldBack}</span><b>${words.nothing}</b></div>
        </div>
      </div>
    </div>

    <div class="lane-rule" style="height:12px"></div>
    <div style="display:flex;justify-content:space-between;align-items:center">
      ${words.strip(RATE).map((line) => `<span class="label" style="font-size:15px;color:${PALETTE.markingDim}">${line}</span>`).join("")}
    </div>
  </div>
</body></html>`;
};

/**
 * The card that carries the addresses, rendered only once there are addresses.
 *
 * A card with a contract address on it is the one thing a reader can check and
 * nobody can alter by quoting it back differently — which only holds if the card
 * cannot print an address this token does not have. So it is built from the
 * `deployed` block the launch wrote, and skipped entirely until there is one.
 */
const addressCard = (token, mark) => `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${BASE}
  body { width: 1600px; height: 900px; overflow: hidden; }
  .frame { width: 1600px; height: 900px; padding: 46px; display: flex; flex-direction: column; gap: 22px; }
  .what { font-family: "Overpass Mono", monospace; font-size: 16px; letter-spacing: .14em; text-transform: uppercase; color: ${PALETTE.markingDim}; }
  .hex { font-family: "Overpass Mono", monospace; font-size: 27px; font-weight: 600; color: ${PALETTE.marking}; margin-top: 4px; }
  .addr { padding: 15px 0; border-bottom: 1px solid rgb(247 250 247 / .22); }
  .addr:last-child { border-bottom: 0; }
</style></head><body>
  <div class="frame road">
    <div class="sign" style="flex:1;min-height:0">
      <div class="inner" style="display:flex;flex-direction:column;padding:32px 40px">
        <div style="display:flex;align-items:center;gap:26px">
          <div style="flex:0 0 auto">${mark(96)}</div>
          <div style="flex:1;min-width:0">
            <h1 class="display" style="font-size:56px;line-height:1;color:${PALETTE.marking}">${token.name}</h1>
            <div class="label" style="margin-top:8px;font-size:15px;color:${PALETTE.marking}">$${token.symbol} &middot; ${CHAIN}</div>
          </div>
          <span class="exit" style="font-size:20px;padding:12px 18px">CHECK THE ADDRESS</span>
        </div>

        <div style="margin-top:22px;border-top:1px solid rgb(247 250 247 / .35)">
          <div class="addr"><div class="what">Token</div><div class="hex">${token.deployed.token}</div></div>
          <div class="addr"><div class="what">Factory &mdash; the board it is on</div><div class="hex">${LAUNCHPAD.factory}</div></div>
          <div class="addr"><div class="what">Hook &mdash; charges the toll</div><div class="hex">${LAUNCHPAD.hook}</div></div>
          <div class="addr"><div class="what">Locker &mdash; holds the liquidity, has no way out</div><div class="hex">${LAUNCHPAD.locker}</div></div>
          <div class="addr"><div class="what">Opened from</div><div class="hex">${LAUNCHPAD.deployer}</div></div>
        </div>
      </div>
    </div>

    <div class="lane-rule" style="height:12px"></div>
    <div style="display:flex;justify-content:space-between;align-items:center">
      <span class="label" style="font-size:15px;color:${PALETTE.markingDim}">NOTICE #${token.deployed.notice}</span>
      <span class="label" style="font-size:15px;color:${PALETTE.markingDim}">A LANE FROM ANY OTHER ADDRESS IS NOT THIS ONE</span>
    </div>
  </div>
</body></html>`;

const out = join(here, "out");
mkdirSync(out, { recursive: true });

// The mark inline rather than as a file: an <img> pointing at a sibling is one
// more thing that can be missing from a screenshot without the screenshot
// failing.
const mark = (size) => markSvg({ size });

writeFileSync(join(out, "mark.svg"), markSvg({ size: 512 }));
await sharp(Buffer.from(markSvg({ size: 1000 }))).png().toFile(join(out, "avatar-1000.png"));

const sheets = [
  { name: "banner-1500x500", html: bannerSheet(token, mark), size: { width: 1500, height: 500 }, faces: FACES },
  { name: "og-1200x630", html: ogSheet(token, mark), size: { width: 1200, height: 630 }, faces: FACES },
  { name: "launch-1600x900", html: launchCard(token, mark), size: { width: 1600, height: 900 }, faces: FACES },
];

// The addresses only go on a card once they exist. Until the launch writes them
// back into token.json there is nothing to print, and a stale card is removed
// rather than left in out/ looking current.
if (token.deployed?.token && LAUNCHPAD.factory) {
  sheets.push({ name: "addresses-1600x900", html: addressCard(token, mark), size: { width: 1600, height: 900 }, faces: FACES });
} else {
  rmSync(join(out, "addresses-1600x900.png"), { force: true });
  console.log("not launched yet, so the card that carries the addresses is not rendered");
}
for (const sheet of sheets) refuseIdentityOnArt(sheet.name, sheet.html, token.profile?.handle);

await shoot(sheets, out);

// The site serves the picture the notice points at, so the file has to be where
// `imageURI` says it is. Copied rather than symlinked: Vercel ships what is in
// `public/`.
const publicDir = join(root, "site", "public");
mkdirSync(publicDir, { recursive: true });
for (const file of ["avatar-1000.png", "banner-1500x500.png", "og-1200x630.png"]) {
  copyFileSync(join(out, file), join(publicDir, file));
}

console.log(`art written to art/out and site/public — toll ${RATE.toll}, from launchpad.json`);

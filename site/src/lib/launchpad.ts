import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Address } from "viem";

import type { TokenLanguage } from "./language";
import { ethPerToken } from "./pool";
import { launchRange, pricePerToken } from "./ticks";

/**
 * The two files this repository is really made of, read at build time.
 *
 * `token.json` is the launch — the same file Toollpad's `npm run launch` sends,
 * so this page and that transaction cannot disagree about the name, the ticker
 * or the range. `launchpad.json` is where the launchpad is and what it charges,
 * copied from its repository at a recorded commit.
 *
 * Both are read while the site is built and never at request time: the page is
 * static, and there is no filesystem to reach on a serving edge.
 */
const root = join(process.cwd(), "..");

type RawToken = {
  name: string;
  symbol: string;
  blurb?: string;
  link?: string;
  launch: { openingEth: string; ceilingEth: string; tickSpacing?: number };
  profile?: {
    displayName?: string;
    handle?: string;
    handleRegistered?: boolean;
    language?: string;
    bio?: Record<string, string>;
  };
  deployed?: { token?: string; notice?: number; launchTx?: string; chainId?: number };
};

type RawLaunchpad = {
  repo: string;
  copiedFrom: string;
  chainId: number;
  poolManager: Address;
  rates: { tollBps: number; creatorBps: number; lpFee: number; supply: string };
  deployed?: { factory?: string; hook?: string; locker?: string };
};

const rawToken = JSON.parse(readFileSync(join(root, "token.json"), "utf8")) as RawToken;
const rawLaunchpad = JSON.parse(readFileSync(join(root, "launchpad.json"), "utf8")) as RawLaunchpad;

const language: TokenLanguage = rawToken.profile?.language === "en" ? "en" : "id";

/** An address and a notice, or neither: half a record is a figure with nothing to attribute it to. */
const onChain =
  /^0x[0-9a-fA-F]{40}$/.test(rawToken.deployed?.token ?? "") && Number.isInteger(rawToken.deployed?.notice)
    ? {
        token: rawToken.deployed!.token as Address,
        notice: rawToken.deployed!.notice as number,
        launchTx: rawToken.deployed?.launchTx ?? null,
      }
    : null;

export const LAUNCHPAD = {
  repo: rawLaunchpad.repo,
  copiedFrom: rawLaunchpad.copiedFrom,
  chainId: rawLaunchpad.chainId,
  poolManager: rawLaunchpad.poolManager,
  tollBps: rawLaunchpad.rates.tollBps,
  creatorBps: rawLaunchpad.rates.creatorBps,
  lpFee: rawLaunchpad.rates.lpFee,
  supply: BigInt(rawLaunchpad.rates.supply),
  /** Empty until Toollpad's 4% contracts are deployed; the page says so rather than guessing. */
  factory: /^0x[0-9a-fA-F]{40}$/.test(rawLaunchpad.deployed?.factory ?? "")
    ? (rawLaunchpad.deployed!.factory as Address)
    : null,
};

export const TOKEN = {
  name: rawToken.name,
  symbol: rawToken.symbol,
  blurb: rawToken.blurb ?? "",
  link: rawToken.link ?? "",
  language,
  displayName: rawToken.profile?.displayName ?? `${rawToken.name} | $${rawToken.symbol}`,
  handle: rawToken.profile?.handle ?? "",
  handleRegistered: rawToken.profile?.handleRegistered === true,
  bio: rawToken.profile?.bio?.[language] ?? "",
  launch: {
    openingEth: rawToken.launch.openingEth,
    ceilingEth: rawToken.launch.ceilingEth,
    tickSpacing: rawToken.launch.tickSpacing ?? 200,
  },
  onChain,
};

/**
 * Where the pool opens, run through the same tick math the launch runs.
 *
 * A valuation is asked for and a tick is what the pool gets; the grid is 200
 * wide and both edges round towards a dearer token, so the sale never starts
 * below the floor. The page prints both, because only one of them is a fact
 * about the transaction.
 */
export function openingValuation() {
  const range = launchRange({
    floorEthPerToken: pricePerToken(TOKEN.launch.openingEth, LAUNCHPAD.supply),
    ceilEthPerToken: pricePerToken(TOKEN.launch.ceilingEth, LAUNCHPAD.supply),
    tickSpacing: TOKEN.launch.tickSpacing,
  });

  return { ...range, eth: ethPerToken(range.sqrtPriceX96) * Number(LAUNCHPAD.supply) };
}

import { Live } from "@/components/Live";
import { Badge } from "@/components/Badge";
import { Panel } from "@/components/Panel";
import { copyFor } from "@/components/copy";
import { formatCount } from "@/lib/format";
import { LAUNCHPAD, TOKEN, openingValuation } from "@/lib/launchpad";

/**
 * The whole site: one token, one page.
 *
 * Two halves, kept apart on purpose. Above, the launch as it is written down in
 * `token.json` — the same file the launch transaction is sent from, so the page
 * and the transaction cannot disagree. Below, what the chain says, read live in
 * the browser, and nothing at all until there is a launch recorded to read.
 */
export default function Page() {
  const copy = copyFor(TOKEN.language);
  const opening = openingValuation();
  const bps = (value: number) => `${value / 100}%`;

  const rows: Array<[string, string, string?]> = [
    [copy.opening, `${opening.eth.toFixed(4)} ETH`, copy.openingHint(TOKEN.launch.openingEth)],
    [copy.range, `${TOKEN.launch.openingEth} ETH → ${TOKEN.launch.ceilingEth} ETH`],
    [copy.supply, formatCount(LAUNCHPAD.supply) ?? "—"],
    [copy.intoPool, copy.allOfIt],
    [copy.toll, bps(LAUNCHPAD.tollBps), copy.bothWays],
    [copy.split, copy.splitValue(bps(LAUNCHPAD.creatorBps), bps(10_000 - LAUNCHPAD.creatorBps))],
    [copy.poolFee, copy.zero],
    [copy.venue, `Uniswap v4 · ETH · Robinhood Chain ${LAUNCHPAD.chainId}`],
    [copy.liquidity, copy.locked],
    [copy.heldBack, copy.nothing],
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/avatar-1000.png"
          alt=""
          width={96}
          height={96}
          className="size-24 shrink-0 rounded-lg border-[3px] border-marking object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-marking">{TOKEN.name}</h1>
            <span className="label font-semibold text-orange">${TOKEN.symbol}</span>
            <Badge tone="exit">{copy.writtenDown}</Badge>
          </div>
          {TOKEN.blurb && <p className="mt-2 text-sm leading-relaxed text-marking-dim">{TOKEN.blurb}</p>}
        </div>
      </header>

      <Panel label={copy.ticket}>
        <dl className="divide-y divide-marking/25">
          {rows.map(([label, value, hint]) => (
            <div
              key={label}
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-2.5 first:pt-0 last:pb-0"
            >
              <dt className="label text-marking-faint">{label}</dt>
              <dd className="text-right text-sm font-semibold text-marking">
                {value}
                {hint && <span className="mt-0.5 block text-xs font-normal text-marking-faint">{hint}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Live
        language={TOKEN.language}
        factory={LAUNCHPAD.factory}
        poolManager={LAUNCHPAD.poolManager}
        onChain={TOKEN.onChain}
      />

      <Panel label={copy.theAccount}>
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="label text-marking-faint">{copy.displayName}</dt>
            <dd className="mt-0.5 text-marking">{TOKEN.displayName}</dd>
          </div>
          <div>
            <dt className="label text-marking-faint">{copy.handle}</dt>
            <dd className="mt-0.5 text-marking">
              {/* A handle nobody has registered is printed as a plan, never as a link:
                  a link to it is an introduction to whoever registers it next. */}
              {TOKEN.handleRegistered ? (
                <a
                  className="underline decoration-orange/40 underline-offset-4 hover:text-orange"
                  href={`https://x.com/${TOKEN.handle.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {TOKEN.handle} ↗
                </a>
              ) : (
                <>
                  <span className="text-marking-dim">{TOKEN.handle}</span>
                  <span className="ml-2 text-xs text-marking-faint">{copy.handleUnregistered}</span>
                </>
              )}
            </dd>
          </div>
          {TOKEN.bio && (
            <div>
              <dt className="label text-marking-faint">{copy.bio}</dt>
              <dd className="mt-0.5 leading-relaxed text-marking-dim">{TOKEN.bio}</dd>
            </div>
          )}
        </dl>
      </Panel>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/banner-1500x500.png" alt="" width={1500} height={500} className="w-full rounded-lg" />

      <p className="label">
        <a className="text-marking-faint hover:text-orange" href={LAUNCHPAD.repo} target="_blank" rel="noreferrer">
          {copy.readMore} ↗
        </a>
      </p>
    </div>
  );
}

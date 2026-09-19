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
          className="size-24 shrink-0 border-2 border-signal/40 bg-ground-lift object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="font-display text-3xl text-lane">{TOKEN.name}</h1>
            <span className="micro font-semibold text-signal">${TOKEN.symbol}</span>
            <Badge tone="signal">{copy.writtenDown}</Badge>
          </div>
          {TOKEN.blurb && <p className="mt-2 text-sm leading-relaxed text-lane-soft">{TOKEN.blurb}</p>}
        </div>
      </header>

      <Panel label={copy.ticket}>
        <dl className="divide-y divide-signal/20">
          {rows.map(([label, value, hint]) => (
            <div
              key={label}
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-2.5 first:pt-0 last:pb-0"
            >
              <dt className="micro text-lane-faint">{label}</dt>
              <dd className="text-right text-sm font-semibold text-lane">
                {value}
                {hint && <span className="mt-0.5 block text-xs font-normal text-lane-faint">{hint}</span>}
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
            <dt className="micro text-lane-faint">{copy.displayName}</dt>
            <dd className="mt-0.5 text-lane">{TOKEN.displayName}</dd>
          </div>
          <div>
            <dt className="micro text-lane-faint">{copy.handle}</dt>
            <dd className="mt-0.5 text-lane">
              {/* A handle nobody has registered is printed as a plan, never as a link:
                  a link to it is an introduction to whoever registers it next. */}
              {TOKEN.handleRegistered ? (
                <a
                  className="underline decoration-signal/40 underline-offset-4 hover:text-signal"
                  href={`https://x.com/${TOKEN.handle.replace(/^@/, "")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {TOKEN.handle} ↗
                </a>
              ) : (
                <>
                  <span className="text-lane-soft">{TOKEN.handle}</span>
                  <span className="ml-2 text-xs text-lane-faint">{copy.handleUnregistered}</span>
                </>
              )}
            </dd>
          </div>
          {TOKEN.bio && (
            <div>
              <dt className="micro text-lane-faint">{copy.bio}</dt>
              <dd className="mt-0.5 leading-relaxed text-lane-soft">{TOKEN.bio}</dd>
            </div>
          )}
        </dl>
      </Panel>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/banner-1500x500.png" alt="" width={1500} height={500} className="w-full border-2 border-signal/35" />

      <p className="micro">
        <a className="text-lane-faint hover:text-signal" href={LAUNCHPAD.repo} target="_blank" rel="noreferrer">
          {copy.readMore} ↗
        </a>
      </p>
    </div>
  );
}

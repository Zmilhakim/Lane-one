"use client";

import { useEffect, useState } from "react";
import { createPublicClient, http, type Address } from "viem";

import { Badge } from "./Badge";
import { Panel } from "./Panel";
import { StatTile } from "./StatTile";
import { copyFor } from "./copy";
import { factoryAbi, type Notice } from "@/lib/abi";
import { explorerAddress, explorerTx, robinhoodChain } from "@/lib/chain";
import type { TokenLanguage } from "@/lib/language";
import { formatEth, formatTokenAmount, shortAddress } from "@/lib/format";
import { decodeSlot0, ethPerToken, extsloadAbi, poolId, poolStateSlot, toollpadPoolKey } from "@/lib/pool";
import { ethInPosition, tokensInPosition } from "@/lib/ticks";

type Props = {
  language: TokenLanguage;
  factory: Address | null;
  poolManager: Address;
  /** Written into `token.json` by the launch, from the receipt. */
  onChain: { token: Address; notice: number; launchTx: string | null } | null;
};

type Reading =
  | { state: "unlaunched" | "no-factory" | "loading" }
  | { state: "mismatch" }
  | { state: "failed"; why: string }
  | { state: "live"; notice: Notice; price: number | null; eth: bigint | null; unsold: bigint | null };

/**
 * What the chain says, read in the browser and nowhere else.
 *
 * There is no wallet here and nothing to connect: the page asks a public node
 * for two words of storage and does the arithmetic itself. It reads the notice
 * this token's own file records — never one matched by ticker, because a ticker
 * is not an identity and anybody can launch another token calling itself the
 * same thing. If the recorded notice holds a different address, nothing is
 * printed: a page that would rather show a number than admit a mismatch is a
 * page nobody should read a number off.
 */
export function Live({ language, factory, poolManager, onChain }: Props) {
  const copy = copyFor(language);
  const [reading, setReading] = useState<Reading>(() =>
    !onChain ? { state: "unlaunched" } : !factory ? { state: "no-factory" } : { state: "loading" },
  );

  useEffect(() => {
    if (!onChain || !factory) return;
    let live = true;

    (async () => {
      try {
        const client = createPublicClient({ chain: robinhoodChain, transport: http() });

        const [notice, hook] = await Promise.all([
          client.readContract({ address: factory, abi: factoryAbi, functionName: "noticeAt", args: [BigInt(onChain.notice)] }),
          client.readContract({ address: factory, abi: factoryAbi, functionName: "hook" }),
        ]);

        const found = notice as unknown as Notice;
        if (found.token.toLowerCase() !== onChain.token.toLowerCase()) {
          if (live) setReading({ state: "mismatch" });
          return;
        }

        const key = toollpadPoolKey(found.token, hook as Address, found.tickSpacing);
        const word = await client.readContract({
          address: poolManager,
          abi: extsloadAbi,
          functionName: "extsload",
          args: [poolStateSlot(poolId(key))],
        });

        const slot0 = decodeSlot0(word as `0x${string}`);
        const priced = slot0.initialized;

        if (live) {
          setReading({
            state: "live",
            notice: found,
            price: priced ? ethPerToken(slot0.sqrtPriceX96) : null,
            eth: priced ? ethInPosition(found.liquidity, slot0.sqrtPriceX96, found.tickLower, found.tickUpper) : null,
            unsold: priced ? tokensInPosition(found.liquidity, slot0.sqrtPriceX96, found.tickLower, found.tickUpper) : null,
          });
        }
      } catch (error) {
        // A node that will not answer is worth saying out loud. The alternative
        // is a page that looks like a launch with nothing in it.
        if (live) setReading({ state: "failed", why: error instanceof Error ? error.message : String(error) });
      }
    })();

    return () => {
      live = false;
    };
  }, [factory, poolManager, onChain]);

  const bought =
    reading.state === "live" && reading.unsold !== null && reading.notice.supply > 0n
      ? Math.max(0, 1 - Number(reading.unsold) / Number(reading.notice.supply))
      : null;

  return (
    <Panel
      label={copy.onChain}
      aside={
        <Badge tone={reading.state === "live" && reading.price !== null ? "live" : "idle"}>
          {reading.state === "live" ? (reading.price !== null ? "live" : "no price") : copy.notLaunched.toLowerCase()}
        </Badge>
      }
    >
      {reading.state === "unlaunched" && <p className="text-sm leading-relaxed text-marking-dim">{copy.notLaunchedBody}</p>}
      {reading.state === "no-factory" && <p className="text-sm leading-relaxed text-marking-dim">{copy.boardClosed}</p>}
      {reading.state === "loading" && <p className="text-sm text-marking-faint">{copy.reading}</p>}
      {reading.state === "mismatch" && <p className="text-sm leading-relaxed text-stop">{copy.mismatch}</p>}
      {reading.state === "failed" && (
        <p className="text-sm leading-relaxed text-stop">
          {copy.unreachable} <span className="text-marking-faint">{reading.why}</span>
        </p>
      )}

      {reading.state === "live" && (
        <>
          <div className="grid gap-2.5 sm:grid-cols-3">
            <StatTile label={copy.price} value={reading.price === null ? copy.none : `${reading.price.toExponential(2)} ETH`} />
            <StatTile label={copy.inThePool} value={formatEth(reading.eth) ?? copy.none} />
            <StatTile label={copy.unsold} value={reading.unsold === null ? copy.none : formatTokenAmount(reading.unsold)} />
          </div>

          {bought !== null && (
            <div className="mt-4">
              <div className="h-1.5 w-full bg-sign-deep">
                <div className="h-full bg-orange" style={{ width: `${Math.round(bought * 100)}%` }} />
              </div>
              <p className="label mt-1 text-marking-faint">
                {Math.round(bought * 100)}% {copy.bought}
              </p>
            </div>
          )}

          <dl className="mt-4 space-y-1.5 text-sm">
            <div className="flex flex-wrap gap-x-2">
              <dt className="label text-marking-faint">{copy.contract}</dt>
              <dd>
                <a
                  className="text-marking-dim underline decoration-orange/40 underline-offset-4 hover:text-orange"
                  href={explorerAddress(reading.notice.token)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {shortAddress(reading.notice.token)} ↗
                </a>
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="label text-marking-faint">{copy.notice}</dt>
              <dd className="text-marking-dim">
                #{String(reading.notice.id)}
                {onChain?.launchTx && (
                  <>
                    {" · "}
                    <a
                      className="underline decoration-orange/40 underline-offset-4 hover:text-orange"
                      href={explorerTx(onChain.launchTx)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      tx ↗
                    </a>
                  </>
                )}
              </dd>
            </div>
          </dl>
        </>
      )}
    </Panel>
  );
}

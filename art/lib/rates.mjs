// The figures on the art, read out of `launchpad.json`.
//
// In Toollpad's own repository these come from the contract source, and the
// render fails rather than printing a rate the hook does not charge. There is no
// contract source in this repository, so they are copied — and copying is worth
// exactly as much as what is recorded beside it: `launchpad.json` names the
// repository and the commit they were copied from, and the site reads the live
// rate off the chain, where a figure that has drifted is visible rather than
// asserted.
//
// What this file can still check, and does: that every figure is present, is a
// number, and agrees with itself. A banner with a blank where the rate goes is
// the failure worth stopping.
import { readFileSync } from "node:fs";

export function readRates(path) {
  const { rates, copiedFrom, repo } = JSON.parse(readFileSync(path, "utf8"));

  if (!/^[0-9a-f]{40}$/.test(copiedFrom ?? "") || !repo) {
    throw new Error("launchpad.json must record the repository and the commit these figures were copied from");
  }

  const { tollBps, creatorBps, lpFee, supply } = rates ?? {};
  for (const [name, value] of Object.entries({ tollBps, creatorBps, lpFee })) {
    if (!Number.isInteger(value) || value < 0 || value > 10_000) {
      throw new Error(`launchpad.json rates.${name} is not basis points: ${value}`);
    }
  }
  if (!/^\d+$/.test(supply ?? "")) throw new Error(`launchpad.json rates.supply is not a whole number: ${supply}`);

  if (lpFee !== 0) throw new Error(`the pool's LP fee is ${lpFee}, so "one fee" is no longer true — rewrite the copy first`);
  if (creatorBps > 10_000 - 0) {
    throw new Error(`rates.creatorBps ${creatorBps} leaves nothing for the treasury`);
  }

  const supplyWei = BigInt(supply) * 10n ** 18n;

  return {
    tollBps,
    creatorBps,
    lpFee,
    supplyWei,
    toll: `${tollBps / 100}%`,
    creator: `${creatorBps / 100}%`,
    treasury: `${(10_000 - creatorBps) / 100}%`,
    supply: BigInt(supply).toLocaleString("en-US"),
  };
}

import type { Address } from "viem";

/**
 * The two constants a Toollpad pool's key carries, repeated here because the
 * pool id is computed from them in the browser.
 *
 * Neither is a setting: `LP_FEE` is a constant in the factory and native ETH is
 * `address(0)` in v4, which is what makes it always `currency0` and the launched
 * token always `currency1`.
 */
export const NATIVE = "0x0000000000000000000000000000000000000000" as Address;
export const LP_FEE = 0;

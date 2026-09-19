/**
 * The two calls this page makes, and nothing else.
 *
 * Hand-written rather than generated: this repository does not hold the
 * contracts, so there is no compile step to generate from. Both fragments are
 * read-only, and a fragment that has drifted from the deployed contract fails
 * the call rather than returning something wrong.
 */
export const factoryAbi = [
  {
    type: "function",
    name: "hook",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "address" }],
  },
  {
    type: "function",
    name: "noticeAt",
    stateMutability: "view",
    inputs: [{ name: "id", type: "uint256" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "id", type: "uint256" },
          { name: "token", type: "address" },
          { name: "creator", type: "address" },
          { name: "name", type: "string" },
          { name: "symbol", type: "string" },
          { name: "imageURI", type: "string" },
          { name: "blurb", type: "string" },
          { name: "link", type: "string" },
          { name: "supply", type: "uint256" },
          { name: "launchedAt", type: "uint256" },
          { name: "tickSpacing", type: "int24" },
          { name: "tickLower", type: "int24" },
          { name: "tickUpper", type: "int24" },
          { name: "liquidity", type: "uint128" },
        ],
      },
    ],
  },
] as const;

export type Notice = {
  id: bigint;
  token: `0x${string}`;
  creator: `0x${string}`;
  name: string;
  symbol: string;
  imageURI: string;
  blurb: string;
  link: string;
  supply: bigint;
  launchedAt: bigint;
  tickSpacing: number;
  tickLower: number;
  tickUpper: number;
  liquidity: bigint;
};

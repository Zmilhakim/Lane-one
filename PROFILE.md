# Lane One — the account

Everything needed to set `$LANE` up, in the fields X asks for. Character counts
were measured, not estimated; X counts Unicode code points, and the em dash
counts as one.

The launch itself is in [`token.json`](token.json) — that file is what
`npm run launch` sends, and this one is what goes around it.

**The account is in English and stays in it.** `profile.language` in
`token.json` is `en`, and the page and the art follow it. An Indonesian bio is
kept in that file under `bio.id` for the day that changes; a feed that switches
language mid-way reads like a feed somebody else took over.

## The name

**Lane One.** The first token launched through Toollpad, and a road the whole way
down: the launchpad is a boom gate, and this is the lane that runs through it.

It is deliberately **not** named after the gate. A token called `$GATE` or
`$TOLL`, wearing the launchpad's own mark, is the exact shape of the fake version
of Toollpad — and the reader who cannot tell them apart is the one it would cost.
The mark here is a lane of road: two solid edge lines and a broken centre line,
drawn on the same twelve-by-twelve grid as the gate and sharing nothing else.

## Ticker

**`$LANE`**. Not `$TOLL`, which is the launchpad's own ticker, and not `$HOOD`,
which is Robinhood's NASDAQ ticker and would read as an official Robinhood asset
to anyone skimming.

## Display name — max 50

**Pick this** (16 characters):

```
Lane One | $LANE
```

Alternatives: `Lane One` (8) · `Lane One — 4% toll, 80% yours` (29)

## Handle

**`@laneone` is a proposal, not a registration.** Nothing here has claimed it, so
nothing here prints it as if it had — not the banner, not the avatar, not the
link preview, and the renderer refuses rather than trusting anyone to remember.

Register it first, then fill in `profile.handle` and `link` in `token.json` and
re-render. If it is taken: `@lane_one`, then `@onelanetoken`. Whichever one is
registered is the only one ever written down here — a handle with two spellings
in circulation is a handle somebody else can be.

## Bio — max 160

**Pick this** (147 characters):

```
One lane, one toll. 4% of every swap on Uniswap v4, 80% of it to whoever launched it. A billion supply, all in the pool. Liquidity locked for good.
```

### The rest of them

| Count | Text |
| --- | --- |
| 140 | `The first lane through the gate. 4% of every swap, 80% of it to whoever launched it. A billion supply, all of it in a pool nobody can drain.` |
| 141 | `One fee, both directions: 4% of everything paid in. The whole billion went into the pool, the pool is locked, and the pool's own fee is zero.` |
| 139 | `Launched through Toollpad on Uniswap v4. 4% toll each way, 80% to the creator. No presale and no allocation — there was nowhere to put one.` |
| 110 | `4% of every swap. 80% of it to the creator. The rest goes into a pool nobody can drain, this account included.` |

### What is deliberately not in any of them

**A price, a market cap, or a holder count.** All three move and a bio does not.
The opening tick values the whole supply at 1.7 ETH, which is a fact about one
transaction and stays true forever — but in a bio it reads as what the token is
worth today, which it will not be by the second trade.

What *is* in them are constants in a contract: `TOLL_BPS` is 400, `CREATOR_BPS`
is 8000 and `FIXED_SUPPLY` is a billion, all in Toollpad's `contracts/src`, none
with a setter. Change one and this file is wrong — so change this file too.

## The blurb on the notice (112 characters)

One sentence that goes on chain with the launch, and is not editable afterwards:

```
The first lane through the gate. Supply all in the pool, liquidity locked, a 4% toll — 80% of it to the creator.
```

## Website

Its own page, already live:

```
https://lane-one-pi.vercel.app
```

That is also `imageURI` and `link` in `token.json` — two values that go on chain
with the notice and cannot be edited afterwards, so both have to point at
something that actually exists before the launch is sent. If a domain of its own
comes later: change `token.json`, deploy, then launch, in that order.

Not an explorer page. It looks like a website, it is not one, and it goes stale
the first time anything is redeployed. The contract address belongs in a post
where it can be read against the chain, and on that page, which reads it from the
chain itself.

## Images

| Field | File | Size |
| --- | --- | --- |
| Profile picture | `art/out/avatar-1000.png` | 1000 × 1000 |
| Header | `art/out/banner-1500x500.png` | 1500 × 500 |
| Link preview | `art/out/og-1200x630.png` | 1200 × 630 |

The avatar is full-bleed: the lines of the lane run off all four edges, so X's
circular crop takes road rather than taking the corners off a picture of road.

Re-render with `npm run render` in [`art/`](art).

## The launch, as it will be sent

| | |
| --- | --- |
| Opening tick | 201800 — 1.7234 ETH for the whole supply |
| Range | 1.7 ETH at the floor, 170 ETH at the ceiling |
| Supply | 1,000,000,000 — all of it into the pool |
| Toll | 4% of everything paid in, either direction |
| Split | 80% creator, 20% treasury |
| Pool fee | Zero |
| Venue | Uniswap v4, native ETH, Robinhood Chain 4663 |
| Liquidity | Locked in the locker, permanently |
| Held back | None of it |

The opening tick is the top of the range: spot starts where the token is
cheapest, so the first buy fills immediately and the pool never asks the locker
for ETH it does not have. It takes roughly `sqrt(1.7 × 170)` ≈ 17 ETH of buying
to work through the whole supply.

**1.7234, not 1.7.** Ticks are a grid 200 wide and 1.7 ETH does not land on one,
so the launch opens at the nearest tick — and both edges round the same way,
towards a dearer token, so the sale never starts below the floor that was asked
for. The art prints 1.7234 because that is what the pool will actually open at;
1.7 is what was asked for, and only one of the two is a fact about the
transaction. `TOKEN=../../lane-one npm run launch` prints both before it sends
anything, and sends nothing without `CONFIRM=launch`.

## Posts

**Launch:**

> Lane One ($LANE) is on the Toollpad board. Uniswap v4, paired against native
> ETH.
>
> A billion supply, all of it in the pool. No presale, no allocation, nothing
> held back — there is nowhere to hold it.
>
> Every swap pays a 4% toll, both directions. 80% of it goes to whoever launched
> it.
>
> The liquidity is locked. Not promised, not timelocked: the locker has no
> function that takes any out.
>
> Contract: 0x…

**Why the rate cannot be changed later:**

> The rate lives in a Uniswap v4 hook, and a pool's hook is part of its key.
>
> So it is fixed the moment the pool opens. Not governed, not timelocked, not
> "no plans to change it" — a different hook is a different pool. The rate on the
> last day is the rate on the first.

**What the creator actually owns:**

> Launch, and you end the transaction holding zero tokens. That is not a catch,
> it is the point: the supply never passes through anybody's hands, so there is
> nothing anyone could dump.
>
> What you own is 80% of the toll, for as long as anyone trades it.

*Image: `art/out/banner-1500x500.png` or `art/out/og-1200x630.png`. Fill the
contract line in from the launch receipt and check it against the chain first —
`npm run status` in Toollpad's `contracts/` prints what the pool manager actually
has. A contract address in a post is the one thing readers cannot verify by
reading the post.*

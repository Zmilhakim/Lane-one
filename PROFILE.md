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

## The look, and why none of it is the launchpad's

Toollpad is a boom gate at night: asphalt, signal yellow, hazard stripes,
Archivo Black over IBM Plex Mono, sharp-cornered panels with a yellow batten.
**None of that appears here**, and that is a rule rather than a preference.

A token wearing its launchpad's palette looks like an official product of that
launchpad — a claim nobody made, nobody checks, and nobody can undo once people
have seen it. It also makes every token launched there look like the same token
with a different name, which is the opposite of what a launch needs.

So Lane One is the road past the gate, in daylight, as highway signage:

| | |
| --- | --- |
| Ground | Worn asphalt `#23282b` — a dot texture, not the launchpad's diagonal tooth |
| Panel | Guide-sign green `#0a5c42`, rounded, white border set in from the edge |
| Paint | Marking white `#f7faf7`, and construction orange `#ff6a13` for the one figure that costs something |
| Face | Overpass and Overpass Mono — Highway Gothic's open-source descendant |
| Rule | A dashed centre line, where the launchpad has hazard stripes |
| Badge | The orange exit tab a guide sign carries in its corner |

The next token launched through Toollpad should take none of this either. Its
own name, its own palette, its own face, its own motif — the launchpad supplies
a pool and a rate, not a house style.

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

**`@getlaneone`** — registered 2026-09-21.

`@laneone` was the proposal and it was taken, so the account carries the `get`
prefix and this file carries the registered spelling and no other. A handle with
two spellings in circulation is a handle somebody else can be: if a post, an
image or a page ever says `@laneone`, it is not this account.

It still appears on no image. That is not about whether it is registered — X
prints the handle in its own chrome above every banner, so an image repeating it
is one more copy to go stale the day the account is renamed, and the renderer
throws rather than trusting anyone to remember. The page is where it is written,
and the page reads it from `token.json`.

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

```
https://laneone.lol
```

Registered 2026-09-20 at Vercel and attached to this project, so it serves this
repository's build and nothing else. `www.laneone.lol` redirects to it.

That is also `imageURI` and `link` in `token.json` — two values that go on chain
with the notice and cannot be edited afterwards. Both point here, and this is the
order that keeps them true: change `token.json`, deploy, check the URL actually
answers, **then** launch. A notice pointing at a page that does not exist yet is
a notice that points at nothing forever.

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

**The voice is signage, not prose.** The launchpad explains itself in
paragraphs, because what it is selling is a mechanism people have to understand
before they trust it. This account is the thing that was launched: short lines,
figures first, no adjective doing work a number could do. Read each post as
something painted on a board at the side of a road — a driver has a second and a
half.

Rules, so a later post does not drift back into the launchpad's voice:

* First line is the sign: two or three words, upper case.
* One fact per line. Numbers before words.
* No adjective that cannot be checked — no "huge", no "insane", no "safest".
* Never a price, a market cap or a holder count. Those move and a post does not.
* **Every post ends on the deployer**, `0xDD6eC911F99C5C468632570e028023B875065453`,
  worked into the sentence rather than tacked on as a label. It is the one line
  a reader can check without trusting the account: a lane that did not come from
  that address is not this lane. It is also the reason the closing line is never
  a call to action — the last thing on the board should be the thing that is
  verifiable, not the thing that is wanted.

Counts are measured, and all five fit in 280 without cutting.

### Launch (279)

> LANE OPEN
>
> Lane One — $LANE. Uniswap v4, native ETH.
>
> 1,000,000,000 supply, all of it in the pool.
> 4% toll each way, 80% to the creator.
> Liquidity locked — the locker has no way out.
>
> CA: 0x…
>
> Opened from 0xDD6eC911F99C5C468632570e028023B875065453. No other address is this lane.

*Fill `CA:` from the launch receipt, and check it against the board before
posting — `npm run status` in the launchpad's `contracts/` prints what the pool
manager actually holds. A contract address in a post is the one thing a reader
cannot verify by reading the post.*

*Image: `art/out/banner-1500x500.png` or `art/out/og-1200x630.png`.*

### When somebody asks for the CA (217)

The standing reply. Post it once under the launch, and again whenever a reply
guy starts handing out addresses.

> CHECK THE ADDRESS
>
> Don't take a CA from a reply. Mine included.
>
> laneone.lol reads the board off the factory. Anything not on it isn't this.
>
> Every real $LANE traces back to 0xDD6eC911F99C5C468632570e028023B875065453.

### On the rate (261)

> NO TOLL BOOTH AHEAD
>
> The rate sits in the pool's hook, and a hook is part of the pool's key.
>
> Fixed when the pool opened. Not governed, not timelocked — a different rate would be a different pool.
>
> 4% each way, 80% to 0xDD6eC911F99C5C468632570e028023B875065453.

### On what is held back (273)

> NOTHING IN RESERVE
>
> No presale. No allocation. No unlock.
>
> The supply went straight into the pool. It never passed through anyone's hands, so there is nothing anybody can sell you out of — not even 0xDD6eC911F99C5C468632570e028023B875065453, which opened it and holds none.

### On the liquidity (275)

The one worth posting before anybody asks, because it is the part that costs
the creator too.

> ONE WAY
>
> Everything paid for the supply becomes liquidity, and liquidity does not come back out. Not for me, not by vote.
>
> The toll comes out. The liquidity does not. Two different promises.
>
> Read the locker yourself — 0xDD6eC911F99C5C468632570e028023B875065453 can't either.

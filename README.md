# Lane One — `$LANE`

One token, launched through [Toollpad](https://github.com/Zmilhakim/toollpad) on
**Uniswap v4**: the whole supply into a pool against native ETH, the pool locked,
and every swap after that paying a **4% toll** — 80% of it to whoever launched
it.

```
token.json       the launch itself — the file Toollpad's `npm run launch` sends
launchpad.json   where the launchpad is, and what it charges
PROFILE.md       the account: display name, handle, bio, and what not to print
art/             the mark, and the avatar, banner and link preview it makes
site/            one page, and it is this token's page
```

## Why this is its own repository

Toollpad is the launchpad and this is a token launched through it. They are
separate repositories for the same reason Toollpad is not in Hood-asset: one
repository feeding several Vercel projects rebuilds all of them on every push,
which spends a day's deployment quota on a change that touched one folder. One
project per repository costs nothing and removes the whole class of problem.

It is also the honest shape. A token is not part of the launchpad — anybody can
post to that board, the launchpad has no owner and this token gets no
special treatment from it.

## The launch

| | |
| --- | --- |
| Opening tick | 1.7234 ETH for the whole supply — 1.7 ETH was asked for |
| Range | 1.7 ETH at the floor, 170 ETH at the ceiling |
| Supply | 1,000,000,000, all of it into the pool |
| Toll | 4% of everything paid in, either direction |
| Split | 80% creator, 20% treasury |
| Pool fee | Zero |
| Venue | Uniswap v4, native ETH, Robinhood Chain 4663 |
| Liquidity | Locked in the locker, permanently |
| Held back | None of it |

Ticks are a grid 200 wide and 1.7 ETH does not land on one, so the launch opens
at the nearest tick — and both edges round towards a dearer token, so the sale
never starts below the floor that was asked for. 1.7234 is what the pool will
actually open at; 1.7 is what was asked for, and only one of the two is a fact
about the transaction.

## Launching it

The transaction is sent from Toollpad's repository, which holds the contracts and
the scripts. Clone the two side by side and point the launch at this file:

```bash
git clone https://github.com/Zmilhakim/toollpad
git clone https://github.com/Zmilhakim/lane-one

cd toollpad/contracts && npm install
TOKEN=../../lane-one/token.json npm run launch                 # prints the plan, sends nothing
TOKEN=../../lane-one/token.json CONFIRM=launch npm run launch  # sends it
```

It prints the plan first, and the toll it prints is read off the factory it is
about to launch into rather than repeated from either repository. After the
receipt it writes the address back into `token.json`, under `deployed` — which is
the only way the page knows which notice on the board is this token. It never
matches on the ticker: a ticker is not an identity, and anybody can launch
another token calling itself the same thing.

**Toollpad's 4% contracts are not deployed yet**, so `launchpad.json` has no
addresses under `deployed` and nothing here has been launched. Both files say so
rather than filling in a placeholder.

## The page

```bash
cd site
npm install
npm run dev        # http://localhost:3000
npm run build
```

Two halves, kept apart. Above, the launch as written down in `token.json` — the
same file the transaction is sent from, so the page and the transaction cannot
disagree. Below, what the chain says: the browser asks a public node for the
notice and two words of the pool manager's storage and does the arithmetic
itself. There is no wallet to connect, no database, and no API in between.

Until there is a launch recorded, the second half says so.

## The art

```bash
cd art
npm install
npm run render
```

`art.mjs` draws the mark as pixels on a twelve-by-twelve grid — no font, no
traced artwork, the same handful of numbers at sixteen pixels and at a thousand.
It is a lane of road: two solid edge lines and a broken centre line.

It is deliberately **not** Toollpad's gate. A token wearing the launchpad's own
mark is the exact shape of the fake version of that launchpad, and the reader who
cannot tell them apart is the one it would cost.

**No handle and no domain on any image.** `@laneone` is a proposal and nothing
here has registered it, so nothing here prints it — the renderer checks each
sheet and throws rather than trusting anyone to remember.

## About the figures on the art

In Toollpad's repository the toll, the split and the supply are read out of the
contract source, and the render fails if the copy disagrees with them. There is
no contract source here, so they are **copied** — `launchpad.json` records the
repository and the commit they were copied from, and that is all a copy is worth.

The check that matters happens on the page instead: it reads the live rate off
the chain, so a figure that has drifted shows up there rather than being asserted
here.

## Not audited, not launched

Nothing in this repository has been deployed. The contracts it describes are
Toollpad's, they are not audited, and the claims worth checking — that the locker
has no function that removes liquidity, that the rate is a constant with no
setter — are claims about that repository's source, which is public and verified
on the explorer once deployed.

// The Lane One mark: a lane of road.
//
// Drawn on the same twelve-by-twelve grid as the launchpad's gate, and drawn as
// pixels for the same reason — no font, no traced artwork, the same handful of
// numbers at sixteen pixels and at a thousand.
//
// It is deliberately *not* the gate, and it is not drawn in the gate's colours
// either. A token wearing its launchpad's mark or palette looks like an official
// product of that launchpad, which is a claim nobody made — so the launchpad is
// a barrier on asphalt and this is a lane on a guide sign: two solid edge lines
// and a broken centre line, the one arrangement of four marks everybody already
// reads as a road.
import { paint } from "./lib/pixels.mjs";

/** The two edge lines, unbroken — the sides of the lane. */
const EDGES = [
  ".##......##.",
  ".##......##.",
  ".##......##.",
  ".##......##.",
  ".##......##.",
  ".##......##.",
  ".##......##.",
  ".##......##.",
  ".##......##.",
  ".##......##.",
  ".##......##.",
  ".##......##.",
];

/**
 * The centre line, broken the way a painted one is: three cells on, one off.
 *
 * Longer than it is wide, which is the whole difference between a dashed line
 * and a column of squares — and it runs off the top and bottom of the square
 * rather than stopping inside it, because a lane does not end at the edge of the
 * picture and a circular crop should take road at every edge it touches.
 */
const CENTRE = Array.from({ length: 12 }, (_, y) => (y % 4 === 3 ? "............" : ".....##....."));

import { PALETTE } from "./lib/palette.mjs";

export const COLOURS = {
  ground: PALETTE.sign, // a guide sign, not the launchpad's asphalt
  edge: PALETTE.marking, // sign white, the colour a lane is painted in
  centre: PALETTE.orange, // and one line that shouts
};

/**
 * The mark, full-bleed on asphalt.
 *
 * Full-bleed because X crops a profile picture to a circle: the lines run off
 * every edge, so the crop takes road rather than taking the corners off a
 * picture of road. `pad` widens the square without moving the lines apart.
 */
export function markSvg({ size = 512, pad = 0 } = {}) {
  return paint({
    layers: [
      [EDGES, COLOURS.edge],
      [CENTRE, COLOURS.centre],
    ],
    background: COLOURS.ground,
    size,
    pad,
  });
}

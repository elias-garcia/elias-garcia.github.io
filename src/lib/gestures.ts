// The image viewer's touch gestures, as numbers. No DOM here.

// How far a finger goes, in CSS pixels, before its direction is known.
const lockAfter = 8;
// How far a swipe or a drag down must go to count.
export const swipeToMove = 50;
export const dragToClose = 80;
// A shorter gesture still counts if it's a flick: this fast, in pixels per
// millisecond, over at least this distance.
const flickSpeed = 0.11;
const flickDistance = 16;
// Past the first or last photo, and dragging the viewer up, the photo
// follows less the further the finger goes.
const edgeFriction = 120;
const upFriction = 60;
// How far a drag down goes before the backdrop is at its faintest.
const fadeDistance = 480;
const faintest = 0.4;

function damp(distance: number, friction: number): number {
  return distance / (1 + Math.abs(distance) / friction);
}

// Which way a gesture goes, once it has gone far enough to tell. It then
// keeps that direction, so a sideways swipe never moves the viewer down.
export function lockDirection(x: number, y: number): "x" | "y" | undefined {
  if (Math.max(Math.abs(x), Math.abs(y)) <= lockAfter) {
    return undefined;
  }
  return Math.abs(y) > Math.abs(x) ? "y" : "x";
}

// A gesture is meant when it went far enough, or was a flick. `elapsed` is
// in milliseconds.
export function isDeliberate(
  distance: number,
  elapsed: number,
  enough: number,
): boolean {
  return (
    Math.abs(distance) > enough ||
    (Math.abs(distance) > flickDistance &&
      Math.abs(distance) / Math.max(1, elapsed) > flickSpeed)
  );
}

// How far the viewer follows a vertical drag: all the way down, less and
// less upwards.
export function followDrag(distance: number): number {
  return distance >= 0 ? distance : damp(distance, upFriction);
}

// How far the photos follow a sideways swipe: all the way, or less and less
// past the first or last photo.
export function followSwipe(distance: number, pastTheEnd: boolean): number {
  return pastTheEnd ? damp(distance, edgeFriction) : distance;
}

// The backdrop's opacity as the viewer is dragged down.
export function backdropFade(distance: number): number {
  return Math.max(faintest, 1 - Math.max(0, distance) / fadeDistance);
}

// An index kept inside a list of `length` items, wrapping at both ends.
export function wrapIndex(index: number, length: number): number {
  return (index + length) % length;
}

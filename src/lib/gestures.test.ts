import assert from "node:assert/strict";
import { test } from "node:test";
import {
  backdropFade,
  dragToClose,
  followDrag,
  followSwipe,
  isDeliberate,
  lockDirection,
  swipeToMove,
  wrapIndex,
} from "./gestures.ts";

test("a gesture has no direction until it has moved a few pixels", () => {
  assert.equal(lockDirection(3, -4), undefined);
  assert.equal(lockDirection(8, 8), undefined);
});

test("a diagonal gesture is a sideways one", () => {
  assert.equal(lockDirection(20, 20), "x");
});

test("a gesture locks to the axis it moved most along", () => {
  assert.equal(lockDirection(20, 5), "x");
  assert.equal(lockDirection(-20, 5), "x");
  assert.equal(lockDirection(5, 20), "y");
  assert.equal(lockDirection(5, -20), "y");
});

test("a long enough gesture counts, however slow", () => {
  assert.equal(isDeliberate(swipeToMove + 1, 5000, swipeToMove), true);
  assert.equal(isDeliberate(-(dragToClose + 1), 5000, dragToClose), true);
});

test("a short slow gesture doesn't count", () => {
  assert.equal(isDeliberate(30, 600, swipeToMove), false);
});

test("a short gesture counts when it's a flick", () => {
  assert.equal(isDeliberate(30, 24, swipeToMove), true);
  assert.equal(isDeliberate(-30, 24, swipeToMove), true);
});

test("a flick needs a minimum distance, however fast", () => {
  assert.equal(isDeliberate(10, 1, swipeToMove), false);
  assert.equal(isDeliberate(16, 1, swipeToMove), false);
  assert.equal(isDeliberate(17, 1, swipeToMove), true);
});

test("a gesture that took no time, or less, is as fast as can be", () => {
  assert.equal(isDeliberate(30, 0, swipeToMove), true);
  assert.equal(isDeliberate(30, -5, swipeToMove), true);
});

test("the viewer follows a drag down exactly, and resists a drag up", () => {
  assert.equal(followDrag(120), 120);
  assert.ok(followDrag(-120) > -120);
  assert.ok(followDrag(-120) < 0);
  assert.ok(followDrag(-10_000) > -60);
});

test("photos follow a swipe exactly, and resist past the ends", () => {
  assert.equal(followSwipe(-90, false), -90);
  assert.ok(followSwipe(-150, true) > -150);
  assert.ok(Math.abs(followSwipe(10_000, true)) < 120);
});

test("the backdrop fades as the viewer goes down, to a floor", () => {
  assert.equal(backdropFade(0), 1);
  assert.equal(backdropFade(-50), 1);
  assert.equal(backdropFade(240), 0.5);
  assert.equal(backdropFade(5000), 0.4);
});

test("an index wraps at both ends", () => {
  assert.equal(wrapIndex(1, 3), 1);
  assert.equal(wrapIndex(3, 3), 0);
  assert.equal(wrapIndex(-1, 3), 2);
});

import { eq } from "./math.js";
import {
  applyKeepMovingIfNoCollision,
  applyMoveToCollidePos,
  applyReflectedVelocityIfCollideWithArena,
  queryArenaCollision,
  warnDiskPenetration,
} from "./system.js";

function it(msg, assert) {
  return (...args) => {
    if (assert(...args) === false) {
      console.error("test failed: " + msg);
    }
  };
}

export const testDiskBouncingAgainstWall =
  () => assertOneDiskPosition(
    { x: 50, y: 50 },
    { x: 0, y: -40 },
    [
      { x: 50, y: 50 },
      { x: 50, y: 20 },
      { x: 50, y: 60 },
      { x: 50, y: 80 },
      { x: 50, y: 40 },
      { x: 50, y: 20 },
    ],
  );

export const testDiskBouncingAgainstWallHorizontal =
  () => assertOneDiskPosition(
    { x: 50, y: 50 },
    { x: -40, y: 0 },
    [
      { x: 50, y: 50 },
      { x: 20, y: 50 },
      { x: 60, y: 50 },
      { x: 80, y: 50 },
      { x: 40, y: 50 },
      { x: 20, y: 50 },
    ],
  );

function assertOneDiskPosition(initP, initV, expectedP) {
  const config = [
    [
      queryArenaCollision,
    ],
    new Set([
      applyReflectedVelocityIfCollideWithArena,
      applyMoveToCollidePos,
      applyKeepMovingIfNoCollision,
    ]),
    [],
    [warnDiskPenetration],
  ];

  const id = 1000;

  const init = () => ({
    elapsed: 0,
    entities: [id],
    velocity: new Map([
      [id, initV],
    ]),
    position: new Map([
      [id, initP],
    ]),
    size: new Map([
      [id, { w: 40, h: 40 }],
    ]),
    mass: new Map([
      [id, 40],
    ]),
    collideNormal: new Map(),
    distanceUntilCollision: new Map(),
    timeUntilCollision: new Map(),
    collideWith: new Map(),
    vPtrJqTable: new Map(),
    needQueryAgain: [true],
    ARENA_W: 100,
    ARENA_H: 100,
  });


  const asserts = [
    it("should bounce back at arena wall", ctx => {
      const expected = expectedP[ctx.elapsed];
      if (expected !== undefined) {
        const v = ctx.position.get(id);
        return eq(v.x, expected.x) && eq(v.y, expected.y);
      } else {
        return true;
      }
    }),
  ];

  return [config, init, asserts];
}
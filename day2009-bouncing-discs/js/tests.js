import { debuggers } from "./config.js";
import {
  applyKeepMovingIfNoCollision,
  applyMoveToCollidePos,
  applyReflectedVelocityIfCollideWithArena,
  queryArenaCollision,
} from "./system.js";

function it(msg, assert) {
  return (...args) => {
    if (assert(...args) === false) {
      console.error("test failed: " + msg);
    }
  };
}

export function testDiskBouncingAgainstWall() {
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
    debuggers,
  ];

  const id = 1000;

  const init = () => ({
    elapsed: 0,
    entities: [id],
    velocity: new Map([
      [id, { x: 0, y: -40 }],
    ]),
    position: new Map([
      [id, { x: 50, y: 50 }],
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

  const expectedYPositions = [null, 20, 60, 80, 40, 20];

  const asserts = [
    it("should stop at arena wall", ctx => {
      const expected = expectedYPositions[ctx.elapsed];
      if (expected !== undefined) {
        return ctx.position.get(id).y === expected;
      } else {
        return true;
      }
    }),
  ];

  return [config, init, asserts];
}
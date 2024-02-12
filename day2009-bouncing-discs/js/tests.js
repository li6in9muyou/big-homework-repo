import { eq, gt } from "./math.js";
import {
  applyConservationOfMomentum,
  applyKeepMovingIfNoCollision,
  applyMoveToCollidePos,
  applyReflectedVelocityIfCollideWithArena,
  logReproductionInfo,
  queryArenaCollision,
  queryDiskCollision,
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

function createStateFromPhysicsState(ps) {
  function toMap(a) {
    if (!(a instanceof Map)) {
      return new Map(a);
    } else {
      return a;
    }
  }

  ps.position = toMap(ps.position);
  ps.size = toMap(ps.size);
  ps.velocity = toMap(ps.velocity);
  ps.mass = toMap(ps.mass);
  return ({
    elapsed: 0,
    collideNormal: new Map(),
    distanceUntilCollision: new Map(),
    timeUntilCollision: new Map(),
    collideWith: new Map(),
    vPtrJqTable: new Map(),
    needQueryAgain: [true],
    ...ps,
  });
}

export function testTouchingDisksOfDifferentVelocityCanSeparate() {
  const init = () => createStateFromPhysicsState({
    entities: [
      1000,
      1001,
    ],
    position: [
      [
        1000,
        { x: 208.9999552389763, y: 675.9999999999992 },
      ],
      [
        1001,
        { x: 209.00001138216948, y: 755.3916666666664 },
      ],
    ],
    size: [
      [
        1000,
        { w: 40, h: 40 },
      ],
      [
        1001,
        { w: 80, h: 80 },
      ],
    ],
    velocity: [
      [
        1000,
        { x: -0.000003078615392322873, y: 65.59999999999994 },
      ],
      [
        1001,
        { x: 7.696538480807182e-7, y: 30.39999999999999 },
      ],
    ],
    mass: [
      [
        1000,
        40,
      ],
      [
        1001,
        160,
      ],
    ],
    ARENA_W: 418,
    ARENA_H: 889,
  });
  const config = [
    [
      queryArenaCollision,
      queryDiskCollision,
    ],
    new Set([
      applyConservationOfMomentum,
      applyMoveToCollidePos,
      applyKeepMovingIfNoCollision,
    ]),
    [],
    [
      warnDiskPenetration,
      logReproductionInfo,
      ({ position, size }) => {
        console.log("distance: center to center", Math.abs(position.get(1000).y - position.get(1001).y));
        console.log("distance: perimeter to perimeter",
          Math.abs(position.get(1000).y - position.get(1001).y) - size.get(1000).w / 2 - size.get(1001).w / 2);
      },
    ],
  ];
  const asserts = [
    it("should collide then separate and keep moving", ({ elapsed, position, velocity }) => {
      switch (elapsed) {
        case 1:
        case 2:
        case 3:
          return gt(Math.abs(position.get(1000).y - position.get(1001).y), 0)
            && gt(velocity.get(1000).y, 0)
            && gt(velocity.get(1001).y, 0);
        default:
          return true;
      }
    }),
  ];
  return [config, init, asserts];
}
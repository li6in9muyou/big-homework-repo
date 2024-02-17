import {
  applyConservationOfMomentum,
  applyKeepMovingIfNoCollision,
  applyMoveToCollidePos,
  applyReflectedVelocityIfCollideWithArena,
  applyRoundMinimalVelocityToZero,
  drawOrangeDisk,
  drawVelocityPointer,
  logDiskDistance,
  logDiskDynamics,
  logElapsed,
  logReproductionInfo,
  queryArenaCollision,
  queryDiskCollision,
} from "./system.js";

const commonLogSuite = [
  logReproductionInfo,
  logDiskDistance,
  logDiskDynamics,
  logElapsed,
];

export const TwoDimElasticCollision = [
  [queryArenaCollision, queryDiskCollision],
  new Set([
    applyReflectedVelocityIfCollideWithArena,
    applyConservationOfMomentum,
    applyMoveToCollidePos,
    applyKeepMovingIfNoCollision,
    applyRoundMinimalVelocityToZero,
  ]),
  [drawOrangeDisk, drawVelocityPointer],
  commonLogSuite,
];

export const TwoDimElasticCollisionNoDraw = TwoDimElasticCollision.toSpliced(
  2,
  1,
  [],
);

export const SingleDiskBouncing = [
  [queryArenaCollision],
  new Set([
    applyReflectedVelocityIfCollideWithArena,
    applyConservationOfMomentum,
    applyMoveToCollidePos,
    applyKeepMovingIfNoCollision,
    applyRoundMinimalVelocityToZero,
  ]),
  [drawOrangeDisk, drawVelocityPointer],
  commonLogSuite,
];

export const SingleDiskBouncingNoDraw = SingleDiskBouncing.toSpliced(2, 1, []);

export function createStateFromDiskDynamics(ps) {
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
  return {
    elapsed: 0,
    collideNormal: new Map(),
    distanceUntilCollision: new Map(),
    timeUntilCollision: new Map(),
    collideWith: new Map(),
    domTableDisk: new Map(),
    domTableVelocityPointer: new Map(),
    ...ps,
  };
}

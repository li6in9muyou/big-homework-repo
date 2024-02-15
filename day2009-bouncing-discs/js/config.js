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

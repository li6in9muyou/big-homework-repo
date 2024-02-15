import {
  applyConservationOfMomentum,
  applyKeepMovingIfNoCollision,
  applyMoveToCollidePos,
  applyReflectedVelocityIfCollideWithArena,
  drawOrangeDisk,
  drawVelocityPointer,
  logDiskDistance,
  logDiskDynamics,
  logElapsed,
  logReproductionInfo,
  queryArenaCollision,
  queryDiskCollision,
  warnDiskPenetration,
} from "./system.js";

const commonLogSuite = [
  warnDiskPenetration,
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
  ]),
  [drawOrangeDisk, drawVelocityPointer],
  commonLogSuite,
];

export const SingleDiskBouncingNoDraw = SingleDiskBouncing.toSpliced(2, 1, []);

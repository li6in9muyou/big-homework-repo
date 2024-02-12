import {
  applyConservationOfMomentum,
  applyKeepMovingIfNoCollision,
  applyMoveToCollidePos,
  applyReflectedVelocityIfCollideWithArena,
  drawOrangeDisk,
  drawVelocityPointer,
  logDiskDistance,
  logReproductionInfo,
  queryArenaCollision,
  queryDiskCollision,
  warnDiskPenetration,
} from "../js/system.js";

export const config = [
  [
    queryArenaCollision,
    queryDiskCollision,
  ],
  new Set([
    applyReflectedVelocityIfCollideWithArena,
    applyConservationOfMomentum,
    applyMoveToCollidePos,
    applyKeepMovingIfNoCollision,
  ]),
  [drawOrangeDisk, drawVelocityPointer],
  [
    warnDiskPenetration,
    logReproductionInfo,
    logDiskDistance,
  ],
];

export const init = (ARENA_W, ARENA_H) => ({
  entities: [1000, 1001],
  velocity: new Map([
    [1000, { x: 0, y: 40 }],
    [1001, { x: 0, y: -40 }],
  ]),
  position: new Map([
    [1000, { x: ARENA_W / 2, y: 20 }],
    [1001, { x: ARENA_W / 2, y: ARENA_H - 40 }],
  ]),
  size: new Map([
    [1000, { w: 40, h: 40 }],
    [1001, { w: 80, h: 80 }],
  ]),
  mass: new Map([
    [1000, 40],
    [1001, 160],
  ]),
  elapsed: 0,
  collideNormal: new Map(),
  distanceUntilCollision: new Map(),
  timeUntilCollision: new Map(),
  collideWith: new Map(),
  vPtrJqTable: new Map(),
  needQueryAgain: [true],
  ARENA_W,
  ARENA_H,
});
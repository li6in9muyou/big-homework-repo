import { lenSqr } from "./math.js";
import {
  applyKeepMovingIfNoCollision,
  applyMoveToCollidePos,
  applyRoundMinimalVelocityToZero,
  applySeparateOverlappedDisks,
  drawOrangeDisk,
  drawVelocityPointer,
  queryArenaCollision,
  queryDiskCollision,
} from "./system.js";


export const queries = [
  queryArenaCollision,
  queryDiskCollision,
];

export const appliers = new Set([
  // applyReflectedVelocityIfCollideWithArena,
  // applyConservationOfMomentum,
  // applyEnergyLoss,
  // applyStopFalling,
  applyMoveToCollidePos,
  applyKeepMovingIfNoCollision,
  applyRoundMinimalVelocityToZero,
  applySeparateOverlappedDisks,
  // applyGravity,
  // applySpawnDisk,
]);

export const drawers = [
  drawOrangeDisk,
  drawVelocityPointer,
];

export const debuggers = [
  ({ position, size, entities }) => {
    for (const id of entities) {
      const penetrateInto = entities
        .filter(e => e !== id)
        .find(e => {
          const p1 = position.get(id);
          const r1 = size.get(id).w / 2;
          const p2 = position.get(e);
          const r2 = size.get(e).w / 2;
          return lenSqr(p1.x - p2.x, p1.y - p2.y) < (r1 + r2) * (r1 + r2);
        });
      if (penetrateInto !== undefined) {
        console.log(`penetration found between ${id} ${penetrateInto}`);
      }
    }
  },
  ({ mass, velocity, entities, elapsed }) => {
    const totalMomentum = entities.reduce((mv, id) => {
      const v = velocity.get(id);
      const m = mass.get(id);
      mv.x += m * v.x;
      mv.y += m * v.y;
      return mv;
    }, { x: 0, y: 0 });
    console.log(`${elapsed} total momentum: x ${totalMomentum.x} y ${totalMomentum.y}`);
  },
];
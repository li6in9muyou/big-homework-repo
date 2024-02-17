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

export const commonLogSuite = [
  logReproductionInfo,
  logDiskDistance,
  logDiskDynamics,
  logElapsed,
];

export const arenaCollision = [queryArenaCollision];
export const arenaAndDiskCollision = [queryArenaCollision, queryDiskCollision];

export const domDrawer = [drawOrangeDisk, drawVelocityPointer];

export const twoDimElastic = [
  applyReflectedVelocityIfCollideWithArena,
  applyConservationOfMomentum,
  applyMoveToCollidePos,
  applyKeepMovingIfNoCollision,
  applyRoundMinimalVelocityToZero,
];

export function buildConfig() {
  const queries = new Set();
  const systems = new Set();
  const drawers = new Set();
  const debuggers = new Set();
  const configBuilder = {
    query(q) {
      q.forEach((qq) => queries.add(qq));
      return configBuilder;
    },
    system(s) {
      s.forEach((ss) => systems.add(ss));
      return configBuilder;
    },
    drawer(d) {
      d.forEach((dd) => drawers.add(dd));
      return configBuilder;
    },
    debug(b) {
      b.forEach((bb) => debuggers.add(bb));
      return configBuilder;
    },
    build() {
      return [queries, systems, drawers, debuggers];
    },
  };
  return configBuilder;
}

export const TwoDimElasticCollision = buildConfig()
  .query(arenaAndDiskCollision)
  .system(twoDimElastic)
  .drawer(domDrawer)
  .debug(commonLogSuite)
  .build();

export const TwoDimElasticCollisionNoDraw = buildConfig()
  .query(arenaAndDiskCollision)
  .system(twoDimElastic)
  .debug(commonLogSuite)
  .build();

export const SingleDiskBouncing = buildConfig()
  .query(arenaCollision)
  .system(twoDimElastic)
  .drawer(domDrawer)
  .debug(commonLogSuite)
  .build();

export const SingleDiskBouncingNoDraw = buildConfig()
  .query(arenaCollision)
  .system(twoDimElastic)
  .debug(commonLogSuite)
  .build();

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

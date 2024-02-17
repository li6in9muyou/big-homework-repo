import { dumpContext } from "./helper.js";
import {
  eq,
  gt,
  isInClosedInterval,
  lenSqr,
  normalized,
  rotate,
  solveLinear,
  solveQuadratic,
} from "./math.js";

const ARENA_TOP = -1;
const ARENA_RIGHT = -2;
const ARENA_BOTTOM = -3;
const ARENA_LEFT = -4;
const ARENA_TOP_LEFT = -5;
const ARENA_TOP_RIGHT = -6;
const ARENA_BOTTOM_RIGHT = -7;
const ARENA_BOTTOM_LEFT = -8;

function isArena(id) {
  return id < 0;
}

export function applyKeepMovingIfNoCollision(
  id,
  { position, velocity, distanceUntilCollision },
) {
  if (distanceUntilCollision.has(id)) {
    return;
  }

  const p = position.get(id);
  const v = velocity.get(id);
  p.x += v.x;
  p.y += v.y;
}

export function applyMoveToCollidePos(
  id,
  { position, distanceUntilCollision },
) {
  if (!distanceUntilCollision.has(id)) {
    return;
  }

  const d = distanceUntilCollision.get(id);
  const p = position.get(id);
  p.x += d.x;
  p.y += d.y;
}

export function queryArenaCollision(
  id,
  {
    position,
    size,
    velocity,
    collideNormal,
    distanceUntilCollision,
    collideWith,
    timeUntilCollision,
    ARENA_W,
    ARENA_H,
  },
) {
  const p = position.get(id);
  const { w, h } = size.get(id);
  const v = velocity.get(id);

  const tToTop = solveLinear(v.y, p.y, h / 2) ?? Infinity;
  const tToRight = solveLinear(v.x, p.x, ARENA_W - w / 2) ?? Infinity;
  const tToBottom = solveLinear(v.y, p.y, ARENA_H - h / 2) ?? Infinity;
  const tToLeft = solveLinear(v.x, p.x, w / 2) ?? Infinity;
  const possibleHitT = gt(0, v.y);
  const possibleHitR = gt(v.x, 0);
  const possibleHitB = gt(v.y, 0);
  const possibleHitL = gt(0, v.x);

  let minTWithInZeroAndOne = Infinity;
  const willReachTop = isInClosedInterval(tToTop, 0, 1);
  if (willReachTop && possibleHitT && tToTop < minTWithInZeroAndOne) {
    minTWithInZeroAndOne = tToTop;
  }
  const willReachRight = isInClosedInterval(tToRight, 0, 1);
  if (willReachRight && possibleHitR && tToRight < minTWithInZeroAndOne) {
    minTWithInZeroAndOne = tToRight;
  }
  const willReachBottom = isInClosedInterval(tToBottom, 0, 1);
  if (willReachBottom && possibleHitB && tToBottom < minTWithInZeroAndOne) {
    minTWithInZeroAndOne = tToBottom;
  }
  const willReachLeft = isInClosedInterval(tToLeft, 0, 1);
  if (willReachLeft && possibleHitL && tToLeft < minTWithInZeroAndOne) {
    minTWithInZeroAndOne = tToLeft;
  }
  if (minTWithInZeroAndOne >= Infinity) {
    return;
  }

  const hitT = minTWithInZeroAndOne === tToTop;
  const hitR = minTWithInZeroAndOne === tToRight;
  const hitB = minTWithInZeroAndOne === tToBottom;
  const hitL = minTWithInZeroAndOne === tToLeft;
  let nX = 0,
    nY = 0;
  if (hitB) {
    nY = -1;
    collideWith.set(id, ARENA_BOTTOM);
  }
  if (hitT) {
    nY = 1;
    collideWith.set(id, ARENA_TOP);
  }
  if (hitL) {
    nX = 1;
    collideWith.set(id, ARENA_LEFT);
  }
  if (hitR) {
    nX = -1;
    collideWith.set(id, ARENA_RIGHT);
  }
  if (hitT && hitL) {
    collideWith.set(id, ARENA_TOP_LEFT);
    console.log("disk hit two sides at once");
  }
  if (hitT && hitR) {
    collideWith.set(id, ARENA_TOP_RIGHT);
    console.log("disk hit two sides at once");
  }
  if (hitB && hitL) {
    collideWith.set(id, ARENA_BOTTOM_LEFT);
    console.log("disk hit two sides at once");
  }
  if (hitB && hitR) {
    collideWith.set(id, ARENA_BOTTOM_RIGHT);
    console.log("disk hit two sides at once");
  }

  if (hitT || hitR || hitB || hitL) {
    timeUntilCollision.set(id, minTWithInZeroAndOne);
    distanceUntilCollision.set(id, {
      x: v.x * minTWithInZeroAndOne,
      y: v.y * minTWithInZeroAndOne,
    });
    collideNormal.set(id, normalized(nX, nY));
    console.log(
      `${id} collide with ${collideWith.get(id)} after ${minTWithInZeroAndOne}`,
    );
  }
}

export function queryDiskCollision(
  id,
  {
    position,
    size,
    velocity,
    collideNormal,
    distanceUntilCollision,
    collideWith,
    timeUntilCollision,
  },
  { getLogger },
) {
  const book = getLogger("queryDiskCollision:");
  const p = position.get(id);
  const v = velocity.get(id);
  const r = size.get(id).w / 2;
  Array.from(position.entries())
    .filter(([other, _]) => other !== id)
    .forEach(([other, otherPos]) => {
      const otherR = size.get(other).w / 2;
      const otherVelocity = velocity.get(other);
      const dPX = p.x - otherPos.x;
      const dPY = p.y - otherPos.y;
      const dVX = v.x - otherVelocity.x;
      const dVY = v.y - otherVelocity.y;
      const A = dVX * dVX + dVY * dVY;
      const B = 2 * dPX * dVX + 2 * dPY * dVY;
      const C = dPX * dPX + dPY * dPY - (r + otherR) * (r + otherR);
      const solution = solveQuadratic(A, B, C);
      if (solution === null) {
        return;
      }

      const [t1, t2] = solution;
      let t = Infinity;
      if (gt(t1, 0) && t1 <= 1 && t1 < t) {
        t = t1;
      }
      if (gt(t2, 0) && t2 <= 1 && t2 < t) {
        t = t2;
      }
      if (t >= Infinity) {
        return;
      }
      book.log(`${id} collide with ${other} after ${t}`);

      const prevT = timeUntilCollision.get(id) ?? Infinity;
      const otherPrevT = timeUntilCollision.get(other) ?? Infinity;
      const setMyCollisionInfo = prevT > t;
      const setOtherCollisionInfo = otherPrevT > t;

      if (setMyCollisionInfo && setOtherCollisionInfo) {
        distanceUntilCollision.set(id, { x: v.x * t, y: v.y * t });
        timeUntilCollision.set(id, t);
        collideNormal.set(id, normalized(p.x - otherPos.x, p.y - otherPos.y));

        distanceUntilCollision.set(other, {
          x: otherVelocity.x * t,
          y: otherVelocity.y * t,
        });
        timeUntilCollision.set(other, t);
        collideNormal.set(
          other,
          normalized(otherPos.x - p.x, otherPos.y - p.y),
        );

        const prevOther = collideWith.get(id);
        collideWith.delete(id);
        collideWith.delete(prevOther);
        collideWith.set(id, other);
        collideWith.set(other, id);
      }
      book.log("timeUntilCollision", dumpContext(timeUntilCollision));
    });
}

export function applyReflectedVelocityIfCollideWithArena(
  id,
  { velocity, collideWith },
) {
  if (!collideWith.has(id)) {
    return;
  }
  const v = velocity.get(id);
  switch (collideWith.get(id)) {
    case ARENA_TOP_LEFT:
    case ARENA_TOP_RIGHT:
    case ARENA_BOTTOM_LEFT:
    case ARENA_BOTTOM_RIGHT:
      v.y *= -1;
      v.x *= -1;
      break;
    case ARENA_TOP:
    case ARENA_BOTTOM:
      v.y *= -1;
      break;
    case ARENA_RIGHT:
    case ARENA_LEFT:
      v.x *= -1;
      break;
  }
}

const ENERGY_LOSS_FACTOR = 0.1;

export function applyEnergyLoss(id, { velocity, collideNormal }) {
  const v = velocity.get(id);
  if (collideNormal.has(id)) {
    v.x = Math.sign(v.x) * Math.sqrt((1 - ENERGY_LOSS_FACTOR) * v.x * v.x);
    v.y = Math.sign(v.y) * Math.sqrt((1 - ENERGY_LOSS_FACTOR) * v.y * v.y);
  }
}

const GRAVITY_ACC = 0.6;

export function applyGravity(id, { velocity }) {
  const v = velocity.get(id);
  v.y += GRAVITY_ACC;
}

export function applyStopFalling(id, { position, velocity, size, ARENA_H }) {
  const v = velocity.get(id);
  const p = position.get(id);
  const s = size.get(id);
  const onTheGround = ARENA_H - (p.y + s.h / 2) <= 0;
  const notBouncingUp = 1 > Math.floor(Math.abs(v.y));
  if (onTheGround && notBouncingUp) {
    v.y = 0;
    // adding 1e-4 makes it sinks a bit into the floor thus keeping
    // it from colliding with the ground
    // so that it can scroll freely on the ground
    p.y = ARENA_H - s.h / 2 + 1e-4;
  }
}

export function drawOrangeDisk(id, { position, size, $arena, domTableDisk }) {
  const s = size.get(id);
  let domBall = domTableDisk.get(id);
  if (domBall === undefined) {
    domBall = $("<div>").addClass("disk").attr("data-id", id);
    $arena.append(domBall);
    domTableDisk.set(id, domBall);
    domBall.css({
      height: s.h + "px",
      width: s.w + "px",
      "background-color": "#f3e322",
    });
  }

  const p = position.get(id);
  domBall.css({
    left: p.x - s.w / 2 + "px",
    top: p.y - s.h / 2 + "px",
  });
}

export function applyConservationOfMomentum(
  id,
  { mass, velocity, collideWith, position },
) {
  if (!collideWith.has(id)) {
    return;
  }
  const other = collideWith.get(id);
  if (isArena(other)) {
    return;
  }
  const v1 = velocity.get(id);
  const v2 = velocity.get(other);
  const p1 = position.get(id);
  const p2 = position.get(other);
  const alreadyApplied =
    0 > (v1.x - v2.x) * (p2.x - p1.x) + (v1.y - v2.y) * (p2.y - p1.y);
  if (alreadyApplied) {
    return;
  }

  const m1 = mass.get(id);
  const m2 = mass.get(other);
  const theta = -Math.atan2(p2.y - p1.y, p2.x - p1.x);
  const _v1 = rotate(v1.x, v1.y, theta);
  const _v2 = rotate(v2.x, v2.y, theta);
  const u1 = rotate(
    (_v1[0] * (m1 - m2)) / (m1 + m2) + (_v2[0] * 2 * m2) / (m1 + m2),
    _v1[1],
    -theta,
  );
  const u2 = rotate(
    (_v2[0] * (m2 - m1)) / (m1 + m2) + (_v1[0] * 2 * m1) / (m1 + m2),
    _v2[1],
    -theta,
  );

  v1.x = u1[0];
  v1.y = u1[1];
  v2.x = u2[0];
  v2.y = u2[1];
}

export function drawVelocityPointer(
  id,
  { velocity, domTableVelocityPointer, domTableDisk },
) {
  let ptr = domTableVelocityPointer.get(id);
  if (ptr === undefined) {
    ptr = $("<div class='velocity-pointer'></div>");
    domTableDisk.get(id).append(ptr);
    domTableVelocityPointer.set(id, ptr);
  }

  const v = velocity.get(id);
  ptr.css("transform", `rotate(${Math.atan2(v.x, -v.y)}rad)`);
}

export function applyRoundMinimalVelocityToZero(id, { velocity }) {
  const v = velocity.get(id);
  if (eq(v.x, 0)) {
    v.x = 0;
  }
  if (eq(v.y, 0)) {
    v.y = 0;
  }
}

const DISK_CNT_LIMIT = 15;
let prevElapsed = NaN;

export function applySpawnDisk(
  id,
  { elapsed, entities, velocity, position, size, mass, ARENA_W, ARENA_H },
) {
  if (elapsed === prevElapsed) {
    return;
  }
  prevElapsed = elapsed;
  if (elapsed % 30 === 0 && entities.length < DISK_CNT_LIMIT) {
    const _v = 10 + Math.random() * 90;
    const [vx, vy] = rotate(0, _v, Math.random() * 2 * Math.PI);
    const id = entities.length;
    entities.push(id);
    velocity.set(id, { x: vx, y: vy });
    position.set(id, { x: ARENA_W / 2, y: ARENA_H / 2 });
    const m = 10 + Math.random() * 50;
    size.set(id, { w: m, h: m });
    mass.set(id, m);
  }
}

export function queryIfShouldPause(predicate) {
  return (...args) => {
    if (predicate(...args)) {
      debugger;
    }
  };
}

export function applySeparateOverlappedDisks(
  _,
  { entities, position, velocity, size },
) {
  entities.forEach((id) => {
    entities
      .filter((other) => other !== id)
      .forEach((other) => {
        const p1 = position.get(id);
        const p2 = position.get(other);
        const r1 = size.get(id);
        const r2 = size.get(id);
        const distance = Math.sqrt(lenSqr(p1.x - p2.x, p1.y - p2.y));
        const overlappedDist = r1 + r2 - distance;
        if (overlappedDist > 0) {
          const displacement = overlappedDist / 2;
          const v1 = velocity.get(id);
          const theta1 = Math.atan2(v1.y, v1.x);
          const disp1X = displacement * Math.cos(theta1);
          const disp1Y = displacement * Math.sin(theta1);
          p1.x += disp1X;
          p1.y += disp1Y;

          const v2 = velocity.get(id);
          const theta2 = Math.atan2(v2.y, v2.x);
          const disp2X = displacement * Math.cos(theta2);
          const disp2Y = displacement * Math.sin(theta2);
          p2.x += disp2X;
          p2.y += disp2Y;
        }
      });
  });
}

export function logTotalMomentum({ mass, velocity, entities, elapsed }) {
  const totalMomentum = entities.reduce(
    (mv, id) => {
      const v = velocity.get(id);
      const m = mass.get(id);
      mv.x += m * v.x;
      mv.y += m * v.y;
      return mv;
    },
    { x: 0, y: 0 },
  );
  console.log(
    `${elapsed} total momentum: x ${totalMomentum.x} y ${totalMomentum.y}`,
  );
}

export function logReproductionInfo({
  elapsed,
  entities,
  mass,
  position,
  size,
  velocity,
  ARENA_W,
  ARENA_H,
}) {
  console.groupCollapsed(`iteration ${elapsed} reproduction info`);
  console.log(
    "reproduction info:\n" +
      dumpContext({
        entities,
        position,
        size,
        velocity,
        mass,
        ARENA_W,
        ARENA_H,
      }),
  );
  console.groupEnd();
}

export function logDiskDynamics({ entities, position, velocity }) {
  for (const id of entities) {
    const p = position.get(id);
    const v = velocity.get(id);
    console.log(`dynamics: ${id} p.x ${p.x} p.y ${p.y} v.x ${v.x} v.y ${v.y}`);
  }
}

export function logDiskDistance({ entities, position, size }) {
  console.groupCollapsed("disk distances");
  for (let i = 0; i < entities.length - 1; i++) {
    const id = entities[i];
    for (let j = i + 1; j < entities.length; j++) {
      const other = entities[j];
      const p1 = position.get(id);
      const p2 = position.get(other);
      const dCenter = Math.sqrt(lenSqr(p1.x - p2.x, p1.y - p2.y));
      const radiusSum = size.get(id).w / 2 + size.get(other).w / 2;
      const dPerimeter = dCenter - radiusSum;
      console.log(
        `${id} ${other} dCenter ${dCenter} dPerimeter ${dPerimeter} radiusSum ${radiusSum}`,
      );
      if (gt(radiusSum, dCenter)) {
        console.warn(`penetration found between ${id} ${other}`);
      }
    }
  }
  console.groupEnd();
}

export function logElapsed({ elapsed }) {
  console.log(`iteration ${elapsed} ends`);
}

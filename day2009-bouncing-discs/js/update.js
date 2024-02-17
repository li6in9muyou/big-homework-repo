import { getLogger } from "./log-util.js";

export default function update(ctx, queries, appliers, drawers, debuggers) {
  for (const id of ctx.entities) {
    queries.forEach((system) => system(id, ctx, { getLogger }));
  }
  for (const id of ctx.entities) {
    appliers.forEach((system) => system(id, ctx, { getLogger }));
  }
  for (const id of ctx.entities) {
    drawers.forEach((system) => system(id, ctx, { getLogger }));
  }
  debuggers.forEach((system) => system(ctx, { getLogger }));
  ctx.collideNormal.clear();
  ctx.distanceUntilCollision.clear();
  ctx.timeUntilCollision.clear();
  ctx.collideWith.clear();
}

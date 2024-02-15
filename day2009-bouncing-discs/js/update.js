export default function update(ctx, queries, appliers, drawers, debuggers) {
  for (const id of ctx.entities) {
    queries.forEach((system) => system(id, ctx));
  }
  for (const id of ctx.entities) {
    appliers.forEach((system) => system(id, ctx));
  }
  for (const id of ctx.entities) {
    drawers.forEach((system) => system(id, ctx));
  }
  debuggers.forEach((system) => system(ctx));
  ctx.needQueryAgain[0] = false;
  ctx.collideNormal.clear();
  ctx.distanceUntilCollision.clear();
  ctx.timeUntilCollision.clear();
  ctx.collideWith.clear();
}

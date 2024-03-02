# disk collision simulation

## Context object

This object type is used in many places

```ts
type Vec = {
  x: number;
  y: number;
};

type DiskDynamics = {
  entities: number[];
  position: Map<number, Vec>;
  velocity: Map<number, Vec>;
  size: Map<number, { w: number; h: number }>;
  mass: Map<number, number>;
};

type SimulationCtx = {
  elapsed: number;
};

type CollisionQueryCtx = {
  collideNormal: Map<number, Vec>;
  distanceUntilCollision: Map<number, number>;
  timeUntilCollision: Map<number, number>;
  collideWith: Map<number, number>;
};

type RendererCtx = {
  domTableDisk: Map<number, jQuery>;
  domTableVelocityPointer: Map<number, jQuery>;
};

type Context = SimulationCtx & CollisionQueryCtx & RendererCtx & DiskDynamics;
```

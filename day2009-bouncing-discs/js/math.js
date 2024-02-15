export function lenSqr(x, y) {
  return x * x + y * y;
}

export function dotProd(x1, y1, x2, y2) {
  return x1 * x2 + y1 * y2;
}

export function subtract(x1, y1, x2, y2) {
  return [x1 - x2, y1 - y2];
}

export function add(x1, y1, x2, y2) {
  return [x1 + x2, y1 + y2];
}

export function normalized(x, y) {
  const len = Math.sqrt(x * x + y * y);
  console.assert(
    Math.abs(len) > 1e-5,
    "error: can not normalize a zero length vector",
  );
  return [x / len, y / len];
}

export function neq(a, b, epsilon = 1e-4) {
  return !eq(a, b, epsilon);
}

export function eq(a, b, epsilon = 1e-4) {
  return epsilon > Math.abs(a - b);
}

export function gt(big, small, epsilon = 1e-4) {
  return big - small > epsilon;
}

export function gte(big, small, epsilon = 1e-4) {
  return gt(big, small, epsilon) || eq(big, small, epsilon);
}

export function solveLinear(a, b, c) {
  // ax + b = c

  if (eq(a, 0)) {
    if (neq(b, c)) {
      return null;
    } else {
      return 0;
    }
  }

  return (c - b) / a;
}

export function solveQuadratic(a, b, c) {
  // ax^2 + bx + c = 0

  const det = Math.sqrt(b * b - 4 * a * c);
  if (Number.isNaN(det)) {
    return null;
  }

  const base = -b / (2 * a);
  const offset = det / (2 * a);
  return [base + offset, base - offset];
}

export function rotate(x, y, theta) {
  return [
    x * Math.cos(theta) - y * Math.sin(theta),
    x * Math.sin(theta) + y * Math.cos(theta),
  ];
}

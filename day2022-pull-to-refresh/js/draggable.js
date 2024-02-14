export const draggableCancelToken = 0xbaaaaaad;

Draggable.chain = function (cb) {
  if (Array.isArray(cb)) {
    return (...args) => cb.reduce((_, fn) => fn(...args), undefined);
  } else {
    return cb;
  }
};

Draggable.pipeMultipleCallbacks = function (cb) {
  if (Array.isArray(cb)) {
    return (oldPos, newPos, ...args) => cb.reduce(
      (updatedNewPos, fn) => fn(oldPos, updatedNewPos, ...args) ?? updatedNewPos, newPos,
    );
  } else {
    return cb;
  }
};

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export function makeClampY(min, max) {
  return (_, newPos) => ({ x: newPos.x, y: clamp(newPos.y, min, max) });
}

export function makeClampX(min, max) {
  return (_, newPos) => ({ x: clamp(newPos.x, min, max), y: newPos.y });
}

export function moveOnlyY(oldPos, newPos) {
  return { x: oldPos.x, y: newPos.y };
}

export function moveOnlyX(oldPos, newPos) {
  return { x: newPos.x, y: oldPos.y };
}

function Draggable(elem, cbDragStart, cbDragEnd, cbDragMove) {
  this.elem = elem;
  if (getComputedStyle(this.elem).position !== "absolute") {
    this.elem.style.position = "relative";
  }

  this.cbDragStart = Draggable.chain(cbDragStart);
  this.cbDragEnd = Draggable.chain(cbDragEnd);
  this.cbDragMove = Draggable.pipeMultipleCallbacks(cbDragMove);
  this.dragging = false;
  this.lastMousePos = { x: 0, y: 0 };
  this.elemPos = { x: 0, y: 0 };
  this.dragKey = NaN;
  elem.addEventListener("touchstart", this.onDragStart.bind(this), { passive: true });
  document.addEventListener("touchmove", this.onDragMove.bind(this));
  document.addEventListener("touchend", this.onDragEnd.bind(this));
  document.addEventListener("touchcancel", (e) => {
    console.log("D touchcancel");
  });
  elem.addEventListener("drag", e => e.preventDefault());
  elem.addEventListener("dragstart", e => e.preventDefault());
}

Draggable.prototype.onDragStart = function (e) {
  console.log("D.onDragStart", e);
  if (!isNaN(this.dragKey) && e.button !== this.dragKey) {
    return;
  }

  if (this.cbDragStart && (this.cbDragStart(e) === draggableCancelToken)) {
    return;
  }

  if (this.dragging) {
    return;
  }

  this.dragKey = e.button;
  this.dragging = true;
  this.elem.dataset.dgDragging = this.dragging;
  this.elemPos = { x: parseInt(this.elem.style.left) || 0, y: parseInt(this.elem.style.top) || 0 };
  this.lastMousePos.x = e.touches[0].clientX;
  this.lastMousePos.y = e.touches[0].clientY;
};

Draggable.prototype.onDragMove = function (e) {
  console.log("D.onDragMove", e);
  if (!this.dragging) {
    return;
  }

  const t = e.touches[0];
  const posDiff = {
    x: t.clientX - this.lastMousePos.x,
    y: t.clientY - this.lastMousePos.y,
  };
  this.lastMousePos.x = t.clientX;
  this.lastMousePos.y = t.clientY;
  let newPos = { ...this.elemPos };
  newPos.x += posDiff.x;
  newPos.y += posDiff.y;
  console.log("D.onDragMove posDiff", posDiff);
  if (this.cbDragMove) {
    newPos = this.cbDragMove(this.elemPos, newPos, e) ?? newPos;
  }

  this.elem.style.top = newPos.y + "px";
  this.elem.style.left = newPos.x + "px";
  this.elemPos = newPos;
};

Draggable.prototype.onDragEnd = function (e) {
  console.log("D.onDragEnd", e);
  if (!isNaN(this.dragKey) && e.button !== this.dragKey) {
    return;
  }
  if (!this.dragging) {
    return;
  }
  this.dragKey = NaN;
  this.dragging = false;
  this.elem.dataset.dgDragging = this.dragging;
  this.cbDragEnd && this.cbDragEnd(e);
};

export default (...args) => new Draggable(...args)
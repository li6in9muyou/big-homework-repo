export function dumpContext(ctx) {
  function replacer(key, value) {
    const tag = value.toString();
    switch (tag) {
      case "[object Map]":
        return Array.from(value.entries()).map(([id, v]) => [
          id,
          JSON.stringify(v).replaceAll('"', ""),
        ]);
      default:
        return value;
    }
  }

  return JSON.stringify(ctx, replacer, 2).replaceAll('"', "");
}

function getRandomColor() {
  return "#" + Math.floor(0xffffff * Math.random()).toString(16);
}

export function shuffleInPlace(arr) {
  let relocatingThis = arr.length;
  while (relocatingThis) {
    const newPos = Math.floor(Math.random() * relocatingThis--);
    const swapWith = arr[relocatingThis];
    arr[relocatingThis] = arr[newPos];
    arr[newPos] = swapWith;
  }
}

export function isFunction(value) {
  return Object.prototype.toString.call(value) === "[object Function]";
}

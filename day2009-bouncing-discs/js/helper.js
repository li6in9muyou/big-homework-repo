function dumpContext(ctx) {
  return JSON.stringify(ctx, null, 2);
}

function getRandomColor() {
  return "#" + Math.floor(0xffffff * Math.random()).toString(16);
}
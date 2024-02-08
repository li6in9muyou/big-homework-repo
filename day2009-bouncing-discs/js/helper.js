function dumpContext(ctx) {
  function replacer(key, value) {
    const tag = value.toString();
    switch (tag) {
      case "[object Map]":
        return Array.from(value.entries())
          .map(([id, v]) => `${id} ${JSON.stringify(v)}`.replaceAll("\"", ""));
      default:
        return value;
    }
  }

  return JSON.stringify(ctx, replacer, 2);
}

function getRandomColor() {
  return "#" + Math.floor(0xffffff * Math.random()).toString(16);
}
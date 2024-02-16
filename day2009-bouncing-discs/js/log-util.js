export function getLogger(label) {
  return {
    log(...args) {
      console.log(label, ...args);
    },
  };
}

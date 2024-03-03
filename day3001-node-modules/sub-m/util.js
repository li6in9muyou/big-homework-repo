exports.noop = function noop() {
  import("../index.js").then((m) => {
    m.printModuleInfo(module);
  });
};

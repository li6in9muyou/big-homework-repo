const { printModuleInfo } = require("../util");
exports.noop = function noop() {
  printModuleInfo(module);
};

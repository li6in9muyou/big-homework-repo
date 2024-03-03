const parentModule = require("..");
exports.noop = function () {
  parentModule.printModuleInfo(module);
};

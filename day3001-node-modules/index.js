const { noop } = require("./sub-m/util.js");
const { printModuleInfo } = require("./util.js");

exports.printModuleInfo = printModuleInfo;

printModuleInfo(module);
noop();

const { noop } = require("./sub-m/util.js");

function printModuleInfo(module) {
  console.log("module.filename", module.filename);
  console.log("module", module);
  console.log("module.exports", module.exports);
  console.log("isExecEntry", require.main === module);
}

exports.printModuleInfo = printModuleInfo;

printModuleInfo(module);
noop();

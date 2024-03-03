function printModuleInfo(module) {
  console.log("module.filename", module.filename);
  console.log("module.path", module.path);
  console.log("module.exports", module.exports);
  console.log("isExecEntry", require.main === module);
}

exports.printModuleInfo = printModuleInfo;

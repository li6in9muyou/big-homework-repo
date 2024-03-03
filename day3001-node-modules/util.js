export function printModuleInfo(m) {
  if (!!m?.exports) {
    console.log("module.filename", m.filename);
    console.log("module.path", m.path);
    console.log("module.exports", m.exports);
    console.log("isExecEntry", m.require.main === m);
  } else {
    console.log("import.meta", m);
  }
}

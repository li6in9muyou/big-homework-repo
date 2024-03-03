import subUtil from "./sub-m/util.js";
import { printModuleInfo } from "./util.js";

const { noop } = subUtil;

export { printModuleInfo };

printModuleInfo(import.meta);
noop();

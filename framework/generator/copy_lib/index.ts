import { copyFileSync } from "fs-extra";
import { config } from "../../lib/config";
import * as fs from "fs";
const distPath = config.output_client + "/biz/";
const libPath = "./framework/lib/";
const generatedDir = config.rest_scan_dir + "/generated/";

console.log("-------------------------");
console.log("- コンフィグコンバート ");
console.log("-------------------------");
const getConfigString = () => {
  const configJSON = JSON.stringify(config, null, 2);
  console.log(configJSON);
  return configJSON;
};
const convertConfigMain = () => {
  const configString = getConfigString();
  const fileName = "/generatedConfig.json";
  const client = config.output_client + fileName;
  const server = config.output_server + fileName;
  fs.writeFileSync(client, configString);
  fs.writeFileSync(server, configString);
};
convertConfigMain();

console.log("-------------------------");
console.log("- フレームワークコードコピー");
console.log("-------------------------");
const copyFileSyncAndLog = (from: string, to: string) => {
  console.log("copy from " + from + " to " + to);
  copyFileSync(from, to);
};
copyFileSyncAndLog(`${libPath}MessageDialog.ts`, `${distPath}MessageDialog.ts`);
copyFileSyncAndLog(
  `${libPath}GeneratedBizBase.ts`,
  `${distPath}GeneratedBizBase.ts`
);
copyFileSyncAndLog(`${libPath}restCallApi.ts`, `${distPath}restCallApi.ts`);
copyFileSyncAndLog(`${libPath}ErrorType.ts`, `${distPath}ErrorType.ts`);
copyFileSyncAndLog(`${libPath}Session.ts`, `${distPath}Session.ts`);
copyFileSyncAndLog(`${libPath}ErrorHandler.ts`, `${distPath}ErrorHandler.ts`);
copyFileSyncAndLog(`${libPath}momentExtends.ts`, `${distPath}momentExtends.ts`);
copyFileSyncAndLog(`${libPath}utils.ts`, `${distPath}utils.ts`);
copyFileSyncAndLog(`${libPath}Response.ts`, `${distPath}Response.ts`);
copyFileSyncAndLog(`${libPath}MaybeError.ts`, `${distPath}MaybeError.ts`);

// generate
copyFileSyncAndLog(`${libPath}web_handler.ts`, `${generatedDir}web_handler.ts`);
copyFileSyncAndLog(
  `${libPath}tokenHandler.ts`,
  `${generatedDir}tokenHandler.ts`
);
copyFileSyncAndLog(`${libPath}Response.ts`, `${generatedDir}Response.ts`);
copyFileSyncAndLog(`${libPath}ErrorResult.ts`, `${generatedDir}ErrorResult.ts`);
copyFileSyncAndLog(`${libPath}ErrorType.ts`, `${generatedDir}ErrorType.ts`);
copyFileSyncAndLog(`${libPath}MaybeError.ts`, `${generatedDir}MaybeError.ts`);
copyFileSyncAndLog(`${libPath}@Rest.ts`, `${generatedDir}@Rest.ts`);
copyFileSyncAndLog(
  `${libPath}@Transactional.ts`,
  `${generatedDir}@Transactional.ts`
);
// copyFileSyncAndLog(`${libPath}@Service.ts`,`${generatedDir}@Service.ts`);
copyFileSyncAndLog(
  `${libPath}ConnectionFactory.ts`,
  `${generatedDir}ConnectionFactory.ts`
);
copyFileSyncAndLog(
  `${libPath}RecoverableError.ts`,
  `${generatedDir}RecoverableError.ts`
);
copyFileSyncAndLog(`${libPath}ErrorResult.ts`, `${generatedDir}ErrorResult.ts`);

console.log("done");

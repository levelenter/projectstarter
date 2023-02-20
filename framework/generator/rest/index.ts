// import { Uri, URIs } from './common/URIs';
import { loadBizClass } from "./loadBizClass";
import { generateClientProxy } from "./generateClientProxy";
import {
  generateRestAPI,
  ignoreTokenFileCreate,
} from "./generateExpressRouter";
import { checkDecorater } from "./checkDecorater";
import { config }  from "../config/config"
import { copyFileSync } from "fs-extra";
import { createIfNotExist } from './restUtil';

const clientPath = config.output_client + "/biz/remote";
// const serverPath = config.output_server;
const generatedDir = config.rest_scan_dir + "/generated/"

const expressRouteGeneratePath = generatedDir + "generatedRest.ts"; // Service classと同じ場所に出力
const ignoreTokenFilePath = generatedDir + "ignoreTokenUriList.ts";
const distPath = config.output_client +"/biz/";
const libPath = "./framework/lib/"


console.log("-------------------------");
console.log("- ロード開始             ");
console.log("-------------------------");
const classes = loadBizClass();

console.log("-------------------------");
console.log("- クライアントサイド生成 ");
console.log("-------------------------");
// クライアントサイド生成
generateClientProxy(classes, clientPath);
console.log("クライアントサイド生成 done");


console.log("-------------------------");
console.log("- サーバーサイド生成     ");
console.log("-------------------------");
// サーバーサイド生成
createIfNotExist(generatedDir);
generateRestAPI(classes, expressRouteGeneratePath);
ignoreTokenFileCreate(classes, ignoreTokenFilePath);
console.log("サーバーサイド生成 done");

console.log("-------------------------");
console.log("- フレームワークコードコピー");
console.log("-------------------------");

copyFileSync(`${libPath}MessageDialog.ts`,`${distPath}MessageDialog.ts`);
copyFileSync(`${libPath}GeneratedBizBase.ts`,`${distPath}GeneratedBizBase.ts`);
copyFileSync(`${libPath}ErrorType.ts`,`${distPath}ErrorType.ts`);
copyFileSync(`${libPath}Session.ts`,`${distPath}Session.ts`);
copyFileSync(`${libPath}ErrorHandler.ts`,`${distPath}ErrorHandler.ts`);
copyFileSync(`${libPath}momentExtends.ts`,`${distPath}momentExtends.ts`);
copyFileSync(`${libPath}utils.ts`,`${distPath}utils.ts`);
copyFileSync(`${libPath}Response.ts`,`${distPath}Response.ts`)
copyFileSync(`${libPath}MaybeError.ts`,`${distPath}MaybeError.ts`);

// generate
copyFileSync(`${libPath}web_handler.ts`,`${generatedDir}web_handler.ts`);
copyFileSync(`${libPath}tokenHandler.ts`,`${generatedDir}tokenHandler.ts`);
copyFileSync(`${libPath}Response.ts`,`${generatedDir}Response.ts`)
copyFileSync(`${libPath}ErrorResult.ts`,`${generatedDir}ErrorResult.ts`);
copyFileSync(`${libPath}ErrorType.ts`,`${generatedDir}ErrorType.ts`);
copyFileSync(`${libPath}MaybeError.ts`,`${generatedDir}MaybeError.ts`);


console.log("-------------------------");
console.log("- 整合性チェック         ");
console.log("-------------------------");
checkDecorater(classes);
console.log("done");

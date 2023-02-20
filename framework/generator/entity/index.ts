#!/usr/bin/env node
import fs from "fs";
import fse from "fs-extra";
import path from "path";
import { EntityMeta } from "./EntityMeta";
import { rebuildFolder, deleteFolderRecursive } from "../cleanFolder";
import { loadMetadataMain } from "./loadMetadataMain";
import config from "../../../generator.config"

// A5SQLファイル
let a5erFile = config.a5erFile;

let generateEntityServer = config.output_server + "/dto";
let generateEntityClient = config.output_client + "/dto";
let generateDaoServer = config.output_server + "/dao";

// Entityを生成
function generate(metas: EntityMeta[], generateDir: string) {
  const generateDirPath = path.resolve(generateDir);
  deleteFolderRecursive(generateDirPath);
  rebuildFolder(generateDirPath);

  // 自動生成開始
  metas.forEach((meta: EntityMeta) => {
    console.log(meta.lName, meta.pName);
    const outFilePath = path.join(generateDirPath, meta.outFileName);
    fs.writeFileSync(outFilePath, meta.toEntityDefString());
  });
}

// DAOを生成
function generateDao(metas: EntityMeta[], generateDir: string) {
  // メタデータから文字列へ
  const generateDirPath = path.resolve(generateDir);
  deleteFolderRecursive(generateDirPath);
  rebuildFolder(generateDirPath);

  // 自動生成開始
  metas.forEach((meta: EntityMeta) => {
    console.log(meta.lName, meta.pName);
    const outFilePath = path.join(generateDirPath, meta.outDaoFileName);
    fs.writeFileSync(outFilePath, meta.toDaoString());
  });
}

function copyFile(from:string,to:string){
  console.log(`copy  start from :${from} to:${to}`);
  fse.copySync(from, to);
  console.log("copy  done");
}

function main() {
  console.log("-------------------------");
  console.log("- DBエンティティ＆DAO生成開始");
  console.log("-------------------------");

  console.log("-------------------------");
  console.log("- ロード開始");
  console.log("-------------------------");
  if (!fs.existsSync(a5erFile)) {
    console.log("a5erファイルが存在しません。処理を終了します。");
    return;
  }
  const metas = loadMetadataMain(a5erFile);

  console.log("-------------------------");
  console.log("- サーバーエンティティ生成");
  console.log("-------------------------");
  generate(metas, generateEntityServer);
  generate(metas, generateEntityClient);

  console.log("-------------------------");
  console.log("- DAO生成");
  console.log("-------------------------");
  generateDao(metas, generateDaoServer);

  console.log("-------------------------");
  console.log("- FRAMEWORKファイルコピー");
  console.log("-------------------------");
  copyFile("./framework/dao/BaseDao.ts", generateDaoServer+ "/BaseDao.ts")
  copyFile("./framework/dao/DBAccessor.ts",generateDaoServer +"/DBAccessor.ts")

  console.log("Generate Done!!!");
}
main();

import fs from "fs";
import path from "path";
import { rebuildFolder, deleteFolderRecursive } from "../cleanFolder";
import { MetaClass } from "./MetaClass";

/**
 * クライアント側プロキシオブジェクト作成
 */
export function generateClientProxy(classes: MetaClass[], dirPath: string) {
  // フォルダを削除
  deleteFolderRecursive(dirPath);
  // フォルダを作成
  rebuildFolder(dirPath);

  // 自動生成開始
  classes.forEach((meta: MetaClass) => {
    if (!meta.hasRestMetod) return;

    console.log(`generete target : ${meta.name} ${meta.hasRestMetod}`);

    // クライアントプロキシをそれぞれのファイルに出力
    console.log("meta.outFileName",dirPath,meta.outFileName)
    const outFilePath = path.join(dirPath, meta.outFileName);
    fs.writeFileSync(outFilePath, meta.toClientDefString());
  });
}

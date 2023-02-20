import fs from 'fs';
import path from 'path';

/**
 * フォルダを再作成する
 * @param folderPath
 */
export function rebuildFolder(folderPath: string) {
  if (!fs.existsSync(folderPath)) {
    const rebuild = path.resolve(folderPath);
    fs.mkdirSync(rebuild, { recursive: true });
  }
}

/**
 * フォルダ内を削除する
 * @param folderPath
 */
export function deleteFolderRecursive(folderPath: string) {
  console.info('delete  to ', folderPath);
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach(function (file, index) {
      const curPath = folderPath + '/' + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
}

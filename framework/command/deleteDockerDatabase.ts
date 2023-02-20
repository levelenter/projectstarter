import fs from "fs";
import path from "path";

const database = path.resolve("./database");
const docker = path.resolve("./database/docker");
const data = path.resolve("./database/docker/data");
const logs = path.resolve("./database/docker/logs");

const deleteFolderRecursive = function(folderPath: string) {
  console.log("delete  to ", folderPath);
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach(function(file, index) {
      const curPath = folderPath + "/" + file;
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
};

function rebuildFolder(folderPath: string) {
  if (!fs.existsSync(folderPath)) {
    const rebuild = path.resolve(folderPath);
    fs.mkdirSync(rebuild, 0o744);
  }
}

// フォルダを削除
if (fs.existsSync(data)) {
  deleteFolderRecursive(data);
}
if (fs.existsSync(logs)) {
  deleteFolderRecursive(logs);
}

// リビルド
rebuildFolder(database);
rebuildFolder(docker);
rebuildFolder(data);
rebuildFolder(logs);

console.log("done");

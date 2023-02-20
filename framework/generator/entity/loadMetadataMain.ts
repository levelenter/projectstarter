import * as fs from "fs";
import * as path from "path";
import { EntityMeta } from "./EntityMeta";

// コンソールログを抑制
// 1-1 ファイルからロード
function loadFileToLineArray(filePath: string): string[] {
  const file = path.resolve(filePath);
  const data = fs.readFileSync(file);
  const erAllString = data.toString("utf-8", 0, data.length);
  const erAll = erAllString.split("\r\n");
  return erAll;
}

// 1 A5SQLのファイルからメタデータを組み立てる
export function loadMetadataMain(a5erFile: string): EntityMeta[] {
  const erAll = loadFileToLineArray(a5erFile);
  const allEntityMetaDatas: EntityMeta[] = [];

  let currentEntity: EntityMeta|null = null;
  let inEntityBlock = false;
  erAll.forEach((line) => {
    const startEntity = line.startsWith(`[Entity]`);
    const endEntity =
      line.startsWith(`[Relation]`) || line.startsWith(`[Comment]`);

    if (startEntity) {
      inEntityBlock = true;
      if (currentEntity) allEntityMetaDatas.push(currentEntity);
      currentEntity = new EntityMeta();
    }

    if (endEntity) {
      inEntityBlock = false;
    }

    if (currentEntity && inEntityBlock) currentEntity.parseLine(line);
  });

  if ( currentEntity ) allEntityMetaDatas.push(currentEntity);
  console.log(allEntityMetaDatas.map((e) => e.lName));
  return allEntityMetaDatas;
}

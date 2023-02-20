import fs from "fs";
export function trimQuate(param: string) {
  return param.replace(/'/g, "").replace(/"/g, "");
}

export function createIfNotExist(path: string): string[] {
  const exists = fs.existsSync(path);
  if (!exists) {
    fs.mkdirSync(path, { recursive: true });
  }
  return fs.readdirSync(path);
}

export function isGenericType(typeString: string) {
  const startGeneric = typeString.indexOf("<");
  return startGeneric > 0;
}

export function getGenericTypeArgType(typeString: string) {
  // GenericTypeの戻り値だった場合
  const endGenerig = typeString.indexOf(">");
  const startGeneric = typeString.indexOf("<");

  // 戻り値の型を取り出す
  return typeString.substring(startGeneric + 1, endGenerig);
}

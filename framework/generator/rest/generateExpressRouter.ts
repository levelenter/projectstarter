import fs from 'fs';
import { MetaClass } from './MetaClass';
import { distinctArray, flatArray } from './common';

/**
 * トークンを無視するための配列ファイルを生成
 * @param classes
 * @param filePath
 */
export function ignoreTokenFileCreate(classes: MetaClass[], filePath: string) {
  // 無視するメソッドのリストを作成
  const ignores = classes.map((c) => c.methods.map((m) => m.ignoredString));

  // フラット化
  const list = flatArray(ignores)
    .filter((i) => i)
    .join('\n');

  // 配列にする
  const src = `export const ignoreTokenUriList = [\n${list}\n];\n`;

  if(fs.existsSync(filePath)){
    fs.unlinkSync(filePath);
  }
  fs.writeFileSync(filePath, src);
}

/**
 * 全てのクラスのexpressルーティングコードを取得する
 * expressのルーティング
 * @param classes
 * @returns
 */
function getAllExpressRoutingString(classes: MetaClass[]): string {
  return classes.reduce((a, c): string => {
    // クラスがRESTメソッドを持っていなければスキップ
    if (!c.hasRestMetod) return `${a}`;
    // クラスのRestコードを取得
    return `${a}${c.toRestString()}\n\n`;
  }, '');
}

/**
 * 引数の型のインポート文字列
 * @param classes
 * @returns
 */
function getParamTypeImport(classes) {
  // 引数の型のインポート部分をまとめる
  const paramDefImportStringArray = classes.map((c) => {
    if (!c.hasRestMetod) return [];
    return c.paramDefImportStringArrayForExpress;
  });
  return flatArray<string>(paramDefImportStringArray);
}

/**
 * Import文をマージして整理
 * @param classImportArray
 * @param paramImportArray
 * @returns
 */
function mergeImportArrayString(classImportArray: string[], paramImportArray: string[]) {
  //
  const importArray = paramImportArray.concat(classImportArray);

  const importArrayString = distinctArray(importArray)
    .filter((i) => i)
    .join('\n');
  console.log('importArrayString', importArrayString);
  return importArrayString;
}

/**
 * Node側のRestAPIルーターを生成する
 * @param classes
 * @param file_path
 */
export function generateRestAPI(classes: MetaClass[], filePath: string) {
  // 引数の型のインポート文字列
  const paramImportArray = getParamTypeImport(classes);

  // // サービスクラスのインポート文字列
  const classImportArray = classes.map((c) => c.getServiceImportForExpressRouter());

  // // インポート文字列をマージして整理
  const importArrayString = mergeImportArrayString(classImportArray, paramImportArray);

  // インポート部分
  let src = '';
  src += `import express from 'express';\n`;
  src += `import { errorHandler } from './web_handler';\n`;
  src += `import { tokenHandler } from './tokenHandler';\n`;
  src += `${importArrayString}\n\n\n`;
  src += `export const generatedRest = express.Router();\n\n`;

  // ルーティングストリング
  src += getAllExpressRoutingString(classes);

  // ファイルに書き出す
  if(fs.existsSync(filePath)){
    fs.unlinkSync(filePath);
  }
  console.log(filePath)
  fs.writeFileSync(filePath, src);
}

import fs from 'fs';
import path from 'path';
import ts from 'typescript';

import { MetaClass } from './MetaClass';
import { MetaMethod } from './MetaMethod';
import { MetaParam } from './MetaParam';
import { config }  from "../config/config"

import { createIfNotExist } from './restUtil';

const IF_PATH = config.rest_scan_dir;

/**
 * ディレクトリかどうかを返す
 * @param fileName
 * @param dir
 */
function isDirectory(fileName: string, dir: string) {
  const fullPath = path.join(dir, fileName);
  return fs.statSync(fullPath).isDirectory();
}

/**
 * TSファイルからTSのメタデータを取り出す
 * @param fileName ソースファイル
 * @param dir ソースディレクトリ
 */
function loadFile(fileName: string, dir: string) {
  const fullPath = path.join(dir, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const target = ts.ScriptTarget.Latest;
  const node = ts.createSourceFile(fileName, fileContents, target);
  return node;
}

export function loadBizClass(): MetaClass[] {
  // 最終戻り値
  const classList: MetaClass[] = [];

  const ifFiles = createIfNotExist(IF_PATH);
  for (const fileName of ifFiles) {
    if (isDirectory(fileName, IF_PATH)) { continue; }

    const node: ts.SourceFile = loadFile(fileName, IF_PATH);
    const srcFile: ts.SourceFile = node.getSourceFile();

    node.forEachChild((child: ts.Node) => {
      if (!ts.isClassDeclaration(child)) {
        // console.error(`${child.getText(srcFile)}は装飾クラス定義ではありません`);
        return;
      }
      // メタクラスのインスタンスを生成
      const metaClass: MetaClass = new MetaClass();

      // クラス名を取得
      if (!child.name) {
        console.log(`名称が取れません`)
        return;
      }
      console.log("装飾クラスの定義です", child.name.escapedText.toString())
      metaClass.name = child.name.escapedText.toString();

      child.members.forEach((member) => {
        const declaration = ts.isMethodDeclaration(member);
        if (!declaration || !ts.canHaveDecorators(member)) {
          console.log("装飾メソッドではありません",member.name?.getText(srcFile))
          return;
        }

        // メタメソッドのインスタンスを生成
        const metaMethod = new MetaMethod();

        const name = member.name;
        if (!ts.isPropertyName(name)) return;
        metaMethod.name = name.getText(srcFile);
        console.log("装飾されたメソッドです",metaMethod.name)

        // パラメータを取り出す
        metaMethod.params = member.parameters.map((param) => {
          if (!param.type) {
            const memberName = member.name.getText(srcFile);
            const paramName = param.name.getText(srcFile);
            throw new Error(`クラス:${fileName} メンバ:${memberName} 引数:${paramName}の引数の型が指定されませんでした`);
          }
          const metaParam = new MetaParam();
          metaParam.name = param.name.getText(srcFile);
          metaParam.type = param.type.getText(srcFile);
          return metaParam;
        });

        // 戻り値
        if (!member.type)
          throw new Error(
            `クラス:${fileName} メンバ:${member.name.getText(srcFile)} の戻り値型が取れない`
          );
        metaMethod.returnType = member.type.getText(srcFile);
        
        const decorators = ts.getDecorators( member)
        if(!decorators) return;

        decorators.forEach((dec) => {
          console.log("dec", dec )
          const l1 = ts.SyntaxKind[dec.expression.kind];
          const decChildren = dec.expression.getChildren(srcFile);

          if (decChildren[0].getText(srcFile) === 'Rest') {
            const params = decChildren[2].getChildren(srcFile);
            metaMethod.uri = params[0].getText(srcFile);
            metaMethod.httpMethod = params[2].getText(srcFile);

            // トークンを必要としない場合"false"
            if (params[4]) {
              const requireToken = params[4].getText(srcFile);
              metaMethod.requireToken = requireToken;
            }

            metaMethod.isRestDecorated = true;
          }
        });

        // メソッドを保存

        metaClass.methods.push(metaMethod);
      });

      // クラス情報を保存
      classList.push(metaClass);
    });
  }
  console.log("classList",classList)
  return classList;
}

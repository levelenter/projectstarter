#!/usr/bin/env node
import { insertCharsetStatement } from "./insertCharsetStatement";
import config from "../../../generator.config"


// createSQLfile
let createSqlFile = config.createdSqlFile;


function main() {

  console.log("-------------------------");
  console.log("- エンコード文字列チェック＋更新");
  console.log("-------------------------");
  insertCharsetStatement(createSqlFile);
  console.log("fix Done!!!");
}
main();

import { DBAccessor } from "./DBAccessor";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import dayjs  from "dayjs";
export class BaseDao {
  db: DBAccessor;
  con: PoolConnection;

  constructor(con: PoolConnection) {
    this.con = con;
    this.db = new DBAccessor(con);
  }

  commit(): void {
    this.con.commit();
  }
  rollback(): void {
    this.con.rollback();
  }
  begin(): void {
    this.con.beginTransaction();
  }

  /**
   * Insert文を生成する
   * @param {*} json
   */
  makeInsertSQL(tableName: string, vo: any): string {
    let insert = "";
    let insertPlaceholder = "";
    for (const item in vo) {
      if (insert === "") {
        insert = " ";
        insertPlaceholder = " ";
      } else {
        insert += " , ";
        insertPlaceholder += " , ";
      }
      insert += " " + item;
      insertPlaceholder += " ? ";
    }
    return `INSERT INTO ${tableName} ( ${insert} ) VALUES ( ${insertPlaceholder} )`;
  }

  makeUpdateSQL(tableName: string, keyVo: any, valueObject: any): string {
    let update = "";
    for (const value in valueObject) {
      if (update === "") {
        update = " ";
      } else {
        update += " , ";
      }
      update += " " + value + " = ? ";
    }
    const where = this.makeWhereSQL(keyVo);
    return `UPDATE ${tableName} SET ${update} WHERE ${where}`;
  }

  /**
   * WhereStringを作成
   * @param {カラムと値のJSON} json
   * @param {区切り文字} separetor
   */
  makeWhereSQL(vo: any): string {
    let result = "";
    for (const key in vo) {
      if (result === "") {
        result = " ";
      } else {
        result += " AND ";
      }
      result += " " + key + " = " + this.quoteValue(vo[key]);
    }
    return result;
  }

  /**
   * SQLのプレイスホルダに当てはめる値の配列を作成
   * @param {カラムと値のJSON} json
   */
  buildParams(json: any): any[] {
    const result:any[] = [];
    for (const key in json) {
      let value = json[key];
      // console.log(value, this.isDate(value));

      if (this.isDate(value)) {
        value = dayjs(value).format("YYYY-MM-DD HH:mm:ss");
        // console.log(value);
      }
      result.push(value);
    }
    return result;
  }

  /**
   * 数値かどうかをチェック
   * @param {*} x
   */
  isNumber(x: any): boolean {
    if (typeof x !== "number" && typeof x === "string") {
      return false;
    } else {
      return x == parseFloat(x) && isFinite(x);
    }
  }

  isDate(x: any): boolean {
    // 数値なら無視
    if (this.isNumber(x)) {
      return false;
    }
    // 文字列の長さがYYYY-M-D で8桁はあるはず
    if (new String(x).length < 8) {
      return false;
    }

    //YYYY-MM-DD形式またはYYYY/MM/DD形式で始まっている
    const match = new String(x).match(/^\d{4}[-/]?\d{1,2}[-/]?\d{1,2}.*$/g);
    if (!match) {
      return false;
    }

    return !isNaN(Date.parse(x));
  }

  /**
   * 数値以外ならシングルクオートで囲む
   * @param {数値または文字} value
   */
  quoteValue(value: any) {
    if (this.isNumber(value)) {
      return value;
    } else {
      return "'" + value + "'";
    }
  }

  /**
   * キーが存在すれば更新、存在しなければ挿入
   * @param {*} valuesJson key 以外の項目JSON
   * @param {*} keyJson "{ user_id: 1 , project_id: 'AAA' }"
   */
  async getInsertOrUpdateSQL(tableName: string, keyJson: any, valuesJson: any): Promise<{ sql: string; param: any[] }> {
    // console.log(tableName, keyJson, valuesJson );
    const where = this.makeWhereSQL(keyJson);
    const whereParams = this.buildParams(keyJson);

    const update = this.makeUpdateSQL(tableName, keyJson, valuesJson);
    const updateParams = this.buildParams(valuesJson);

    const keyAndvalueJson = Object.assign(keyJson, valuesJson); // 合体したオブジェクトを作る
    const insert = this.makeInsertSQL(tableName, keyAndvalueJson);
    const insertParams = this.buildParams(keyAndvalueJson);

    const selsql = `SELECT * FROM ${tableName} WHERE ${where} `;
    // console.log(selsql);
    const results = await this.db.query(selsql, whereParams);

    // 存在するならアップデート
    // let resultAll = null;
    if (results.length > 0) {
      // resultAll = await this.db.execute( update, updateParams);
      await this.db.execute(update, updateParams);
      // 存在しないならインサート
      return { sql: update, param: updateParams };
    } else {
      return { sql: insert, param: insertParams };
    }
  }

  /**
   * キーが存在すれば更新、存在しなければ挿入
   * @param {*} valuesJson key 以外の項目JSON
   * @param {*} keyJson "{ user_id: 1 , project_id: 'AAA' }"
   */
  async insertOrUpdateByObject(tableName: string, keyJson: any, valuesJson: any): Promise<ResultSetHeader> {
    const result = await this.getInsertOrUpdateSQL(tableName, keyJson, valuesJson);

    // console.log("insertOrUpdate", result.sql, result.param);

    const resultAll = await this.db.execute(result.sql, result.param);
    return resultAll;
  }
}

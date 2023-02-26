// 参考 https://qiita.com/PianoScoreJP/items/7ed172cd0e7846641e13

import mysql from 'mysql2/promise';
import { config } from 'config';

/**
 * コンフィグからコネクションを生成
 */
console.log('config', config);
export class DBConnectionFactory{
  public connection = mysql.createPool({
    connectionLimit: 50,
    host: config.get<string>('db.host'),
    database: config.get<string>('db.database'),
    user: config.get<string>('db.user'),
    password: config.get<string>('db.password'),
    ssl: {
      ca: config.get<string>('db.ssl.ca'),
      rejectUnauthorized: false,
    },
  });

  constructor(){
    /**
     * コネクションの接続時に実施する
     */
    this.connection.on('connection', function (connection) {
      connection.query('SET SESSION auto_increment_increment=1');
      console.info('connection use ');
    });
    
    /**
     * コネクションをキューイングした時に発生するイベント
     */
    this.connection.on('enqueue', function () {
      console.info('Waiting for available connection slot');
    });
  }

  
  /**
   * コネクションを取得してサーバーにPingをうつ
   */
  async connectionConfirm(): Promise<void> {
    let conn;
    try {
      conn = await this.connection.getConnection();
    } catch (err) {
      console.error('Mysql に接続できませんでした。', err);
      throw err;
    }
    try {
      await conn.ping();
    } catch (pingerr) {
      console.error('DBサーバーにPingが通りませんでした。', pingerr);
      throw pingerr;
    }
    console.info('DBサーバーの起動を確認しました。');
  };
  
  
  /**
   * DBエラー発生時の共通的なエラー処理
   * @param {エラー情報} err
   * @param {レスポンス} res
   */
  errorResponse(err, res) {
    console.error(err);
  }
  
  /**
   * 数値かどうかをチェック
   * @param {*} x
   */
  isNumber(x) : boolean {
    if (typeof x != 'number' && typeof x == 'string') return false;
    else return x == parseFloat(x) && isFinite(x);
  };
  
  /**
   * 数値以外ならシングルクオートで囲む
   * @param {数値または文字} value
   */
  quoteValue(value){
    if (this.isNumber(value)) {
      return value;
    } else {
      return "'" + value + "'";
    }
  };
  
  /**
   * Insert文を生成する
   * @param {*} json
   */
  makeInsertSQL(tableName, json) {
    let insert = '';
    let insertPlaceholder = '';
    for (const item in json) {
      if (insert === '') {
        insert = ' ';
        insertPlaceholder = ' ';
      } else {
        insert += ' , ';
        insertPlaceholder += ' , ';
      }
      insert += ' ' + item;
      insertPlaceholder += ' ? ';
    }
    return `INSERT INTO ${tableName} ( ${insert} ) VALUES ( ${insertPlaceholder} )`;
  };
  
  makeUpdateSQL(tableName, keyJson, valueJson){
    let update = '';
    for (const value in valueJson) {
      if (update === '') {
        update = ' ';
      } else {
        update += ' , ';
      }
      update += ' ' + value + ' = ? ';
    }
    const where = this.makeWhereSQL(keyJson);
    return `UPDATE ${tableName} SET ${update} WHERE ${where}`;
  };
  
  /**
   * WhereStringを作成
   * @param {カラムと値のJSON} json
   * @param {区切り文字} separetor
   */
  makeWhereSQL(json){
    let result = '';
    for (const key in json) {
      if (result === '') {
        result = ' ';
      } else {
        result += ' AND ';
      }
      result += ' ' + key + ' = ' + this.quoteValue(json[key]);
    }
    return result;
  };
  /**
   * SQLのプレイスホルダに当てはめる値の配列を作成
   * @param {カラムと値のJSON} json
   */
  buildParams (json) {
    const result: any[] = [];
    for (const key in json) {
      result.push(json[key]);
    }
    return result;
  };
  
  /**
   * キーが存在すれば更新、存在しなければ挿入
   * @param {*} valuesJson key 以外の項目JSON
   * @param {*} keyJson "{ user_id: 1 , project_id: 'AAA' }"
   */
  async insertOrUpdate(
    tableName: string,
    keyJson: any,
    valuesJson: any
  ): Promise<any>{
    const where = this.makeWhereSQL(keyJson);
    const whereParams = this.buildParams(keyJson);
  
    const update = this.makeUpdateSQL(tableName, keyJson, valuesJson);
    const updateParams = this.buildParams(valuesJson);
  
    const keyAndvalueJson = Object.assign(keyJson, valuesJson); // 合体したオブジェクトを作る
    const insert = this.makeInsertSQL(tableName, keyAndvalueJson);
    const insertParams = this.buildParams(keyAndvalueJson);
  
    const selsql = `SELECT * FROM ${tableName} WHERE ${where} `;
    // console.log('selsql', selsql);
  
    const results = await this.connection.query<[any, any]>(selsql, whereParams);
    if (results[0].length > 0) {
      // 存在するならアップデート
      // console.log('update', update);
      const upResult = this.connection.execute(update, updateParams);
      return upResult;
    } else {
      // 存在しないならインサート
      // console.log('insert', insert);
      const insResult = this.connection.execute(insert, insertParams);
      return insResult;
    }
  };
  
  
}


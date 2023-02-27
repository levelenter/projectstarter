import { beforeAll, expect, test } from 'vitest';
import { DBConnectionFactory } from '../src/dao/DBConnectionFactory';
import { AuthService } from '../src/biz/AuthService';
import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

beforeAll(async () => {
  console.log("テスト前テーブル削除");
  const factory = new DBConnectionFactory();
  const con = factory.connection;
  await con.execute(`DELETE FROM users WHERE mail = ?`,["dai.yamamoto@levelenter.com"])
});

test("DBにPingを打って帰ってきたらOK",async ()=>{
  const factory = new DBConnectionFactory();
  const con = factory.connection;
  const con2 = await con.getConnection()
  const pin = await con2.ping();
  expect(pin).toBeTruthy();
})

test("DBのデーターベースを一覧する1",async (done)=>{
  const factory = new DBConnectionFactory();
  const con = factory.connection;
  const db = await con.query<RowDataPacket[]>("show databases")
  const row = db[0].filter((i:RowDataPacket) =>{ return i["Database"] === "starter"})
  console.log(row[0])
  expect(row[0].Database).toBe("starter");
})

test("DBのデーターベースを一覧する2",async (done)=>{
  const pool = mysql.createPool({host:"localhost",port:3307,database:"starter",user:"root",password:"root"})
  const connection = await pool.getConnection();
  const db = await connection.query<RowDataPacket[]>("show databases")
  const row = db[0].filter((i:RowDataPacket) =>{ return i["Database"] === "starter"})
  console.log(row[0])
  expect(row[0].Database).toBe("starter");
})

test("ユーザーを追加する",async() =>{
  const factory = new DBConnectionFactory();
  const con = factory.connection;
  const biz = new AuthService();
  biz.connection = await con.getConnection();

  const result = await biz.createUserApi("dai.yamamoto@levelenter.com","levelenter","dai.yamamoto","")
  const data = result.data
  expect(data.user_name).toBe("dai.yamamoto")

  const queryResult = await con.query<RowDataPacket[]>("select * from users where mail = ?",["dai.yamamoto@levelenter.com"])
  expect( queryResult[0][0]["mail"]).toBe("dai.yamamoto@levelenter.com")
})


test("ユーザーログインする",async() =>{
  const factory = new DBConnectionFactory();
  const con = factory.connection;
  const biz = new AuthService();
  biz.connection = await con.getConnection();

  const result = await biz.login("dai.yamamoto@levelenter.com","levelenter")
  const data = result.data
  expect(data.user_name).toBe("dai.yamamoto")
  expect(data.token).not.toBeNull();
  
})
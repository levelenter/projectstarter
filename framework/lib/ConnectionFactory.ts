import mysql from 'mysql2';
import config from 'config';
import { PoolConnection, Pool } from 'mysql2/promise';

/**
 * コンフィグからコネクションを生成
 */
export const connectionPool: Pool = mysql
  .createPool({
    connectionLimit: 10,
    host: config.get<string>('db.host'),
    database: config.get<string>('db.database'),
    user: config.get<string>('db.user'),
    password: config.get<string>('db.password'),
    port: config.get<number>('db.port'),
  })
  .promise();

export class ConnectionFactory {
  getPool() {
    return connectionPool;
  }

  async getConnection(): Promise<PoolConnection> {
    const pool = this.getPool();
    const con = pool.getConnection();
    return con;
  }
}

/**
 * コネクションを取得してサーバーにPingをうつ
 */
export async function firstConnection(pool?: Pool) {
  let conn;
  try {
    if (!pool) {
      pool = connectionPool;
    }
    conn = await pool.getConnection();
  } catch (err) {
    console.error(err);
    return;
  }

  try {
    conn.ping();
  } catch (pingErr) {
    console.error('DBサーバーにPingが通りませんでした。', pingErr);
  }
  console.info('DBサーバーの起動を確認しました。');
  return;
}

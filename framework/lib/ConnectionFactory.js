"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firstConnection = exports.ConnectionFactory = exports.connectionPool = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const config_1 = __importDefault(require("config"));
/**
 * コンフィグからコネクションを生成
 */
exports.connectionPool = mysql2_1.default
    .createPool({
    connectionLimit: 10,
    host: config_1.default.get('db.host'),
    database: config_1.default.get('db.database'),
    user: config_1.default.get('db.user'),
    password: config_1.default.get('db.password'),
    port: config_1.default.get('db.port'),
})
    .promise();
class ConnectionFactory {
    getPool() {
        return exports.connectionPool;
    }
    async getConnection() {
        const pool = this.getPool();
        const con = pool.getConnection();
        return con;
    }
}
exports.ConnectionFactory = ConnectionFactory;
/**
 * コネクションを取得してサーバーにPingをうつ
 */
async function firstConnection(pool) {
    let conn;
    try {
        if (!pool) {
            pool = exports.connectionPool;
        }
        conn = await pool.getConnection();
    }
    catch (err) {
        console.error(err);
        return;
    }
    try {
        conn.ping();
    }
    catch (pingErr) {
        console.error('DBサーバーにPingが通りませんでした。', pingErr);
    }
    console.info('DBサーバーの起動を確認しました。');
    return;
}
exports.firstConnection = firstConnection;
//# sourceMappingURL=ConnectionFactory.js.map
// ユーザーのDAO
import { BaseDao } from "./BaseDao";
import { ResultSetHeader } from 'mysql2';
import { Users } from '../dto/Users';
export class UsersDaoGen extends BaseDao {
  public readonly TABLE_NAME = "users";

  // Usersを全件取得
  async selectAll(): Promise<Users[]> {
    const sql = 'SELECT * FROM users ';
    return await this.db.query<Users>(sql);
  }
  // Usersを主キーで取得
  async selectById(user_id: number): Promise<Users> {
    const sql = 'SELECT * FROM users WHERE  user_id = ?  ';
    const params = [user_id];
    const results = await this.db.query<Users>(sql, params);
    return results[0];
  }
  // Usersを主キーで削除
  async deleteById(user_id: number): Promise<ResultSetHeader> {
    const sql = 'DELETE FROM users WHERE  user_id = ?  ';
    const params = [user_id];
    return await this.db.execute(sql, params);
  }
  // Usersを挿入
  async insert(value: Users): Promise<ResultSetHeader> {
    const sql = this.makeInsertSQL('users', value);
    const params = this.buildParams(value);
    return await this.db.execute(sql, params);
  }
  // Usersを主キーで更新
  async update(value: Users): Promise<ResultSetHeader> {
    const keyVo = { user_id: value.user_id };
    const sql = this.makeUpdateSQL('users', keyVo, value);
    const params = this.buildParams(value);
    return await this.db.execute(sql, params);
  }
  // Usersを主キーで検索し、なければ挿入、あれば更新
  async insertOrUpdate(entity: Users): Promise<ResultSetHeader> {
    return this.insertOrUpdateByObject(this.TABLE_NAME, entity.getPrimaryKeys(), entity);
  }
}

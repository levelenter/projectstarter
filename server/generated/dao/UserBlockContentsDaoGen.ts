// user_block_contentsのDAO
import { BaseDao } from "./BaseDao";
import { ResultSetHeader } from 'mysql2';
import { UserBlockContents } from '../dto/UserBlockContents';
export class UserBlockContentsDaoGen extends BaseDao {
  public readonly TABLE_NAME = "user_block_contents";

  // UserBlockContentsを全件取得
  async selectAll(): Promise<UserBlockContents[]> {
    const sql = 'SELECT * FROM user_block_contents ';
    return await this.db.query<UserBlockContents>(sql);
  }
  // UserBlockContentsを主キーで取得
  async selectById(user_block_contents_id: number): Promise<UserBlockContents> {
    const sql = 'SELECT * FROM user_block_contents WHERE  user_block_contents_id = ?  ';
    const params = [user_block_contents_id];
    const results = await this.db.query<UserBlockContents>(sql, params);
    return results[0];
  }
  // UserBlockContentsを主キーで削除
  async deleteById(user_block_contents_id: number): Promise<ResultSetHeader> {
    const sql = 'DELETE FROM user_block_contents WHERE  user_block_contents_id = ?  ';
    const params = [user_block_contents_id];
    return await this.db.execute(sql, params);
  }
  // UserBlockContentsを挿入
  async insert(value: UserBlockContents): Promise<ResultSetHeader> {
    const sql = this.makeInsertSQL('user_block_contents', value);
    const params = this.buildParams(value);
    return await this.db.execute(sql, params);
  }
  // UserBlockContentsを主キーで更新
  async update(value: UserBlockContents): Promise<ResultSetHeader> {
    const keyVo = { user_block_contents_id: value.user_block_contents_id };
    const sql = this.makeUpdateSQL('user_block_contents', keyVo, value);
    const params = this.buildParams(value);
    return await this.db.execute(sql, params);
  }
  // UserBlockContentsを主キーで検索し、なければ挿入、あれば更新
  async insertOrUpdate(entity: UserBlockContents): Promise<ResultSetHeader> {
    return this.insertOrUpdateByObject(this.TABLE_NAME, entity.getPrimaryKeys(), entity);
  }
}

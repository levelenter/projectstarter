// 通知メッセージのDAO
import { BaseDao } from "./BaseDao";
import { ResultSetHeader } from 'mysql2';
import { NotifyMessage } from '../dto/NotifyMessage';
export class NotifyMessageDaoGen extends BaseDao {
  public readonly TABLE_NAME = "notify_message";

  // NotifyMessageを全件取得
  async selectAll(): Promise<NotifyMessage[]> {
    const sql = 'SELECT * FROM notify_message ';
    return await this.db.query<NotifyMessage>(sql);
  }
  // NotifyMessageを主キーで取得
  async selectById(notify_id: number): Promise<NotifyMessage> {
    const sql = 'SELECT * FROM notify_message WHERE  notify_id = ?  ';
    const params = [notify_id];
    const results = await this.db.query<NotifyMessage>(sql, params);
    return results[0];
  }
  // NotifyMessageを主キーで削除
  async deleteById(notify_id: number): Promise<ResultSetHeader> {
    const sql = 'DELETE FROM notify_message WHERE  notify_id = ?  ';
    const params = [notify_id];
    return await this.db.execute(sql, params);
  }
  // NotifyMessageを挿入
  async insert(value: NotifyMessage): Promise<ResultSetHeader> {
    const sql = this.makeInsertSQL('notify_message', value);
    const params = this.buildParams(value);
    return await this.db.execute(sql, params);
  }
  // NotifyMessageを主キーで更新
  async update(value: NotifyMessage): Promise<ResultSetHeader> {
    const keyVo = { notify_id: value.notify_id };
    const sql = this.makeUpdateSQL('notify_message', keyVo, value);
    const params = this.buildParams(value);
    return await this.db.execute(sql, params);
  }
  // NotifyMessageを主キーで検索し、なければ挿入、あれば更新
  async insertOrUpdate(entity: NotifyMessage): Promise<ResultSetHeader> {
    return this.insertOrUpdateByObject(this.TABLE_NAME, entity.getPrimaryKeys(), entity);
  }
}

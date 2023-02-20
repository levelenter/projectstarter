// クラスメンバーのDAO
import { BaseDao } from "./BaseDao";
import { ResultSetHeader } from 'mysql2';
import { ClassMembers } from '../dto/ClassMembers';
export class ClassMembersDaoGen extends BaseDao {
  public readonly TABLE_NAME = "class_members";

  // ClassMembersを全件取得
  async selectAll(): Promise<ClassMembers[]> {
    const sql = 'SELECT * FROM class_members ';
    return await this.db.query<ClassMembers>(sql);
  }
  // ClassMembersを主キーで取得
  async selectById(user_id: number, member_id: number): Promise<ClassMembers> {
    const sql = 'SELECT * FROM class_members WHERE  user_id = ?  AND  member_id = ?  ';
    const params = [user_id, member_id];
    const results = await this.db.query<ClassMembers>(sql, params);
    return results[0];
  }
  // ClassMembersを主キーで削除
  async deleteById(user_id: number, member_id: number): Promise<ResultSetHeader> {
    const sql = 'DELETE FROM class_members WHERE  user_id = ?  AND  member_id = ?  ';
    const params = [user_id, member_id];
    return await this.db.execute(sql, params);
  }
  // ClassMembersを挿入
  async insert(value: ClassMembers): Promise<ResultSetHeader> {
    const sql = this.makeInsertSQL('class_members', value);
    const params = this.buildParams(value);
    return await this.db.execute(sql, params);
  }
  // ClassMembersを主キーで更新
  async update(value: ClassMembers): Promise<ResultSetHeader> {
    const keyVo = { user_id: value.user_id, member_id: value.member_id };
    const sql = this.makeUpdateSQL('class_members', keyVo, value);
    const params = this.buildParams(value);
    return await this.db.execute(sql, params);
  }
  // ClassMembersを主キーで検索し、なければ挿入、あれば更新
  async insertOrUpdate(entity: ClassMembers): Promise<ResultSetHeader> {
    return this.insertOrUpdateByObject(this.TABLE_NAME, entity.getPrimaryKeys(), entity);
  }
}

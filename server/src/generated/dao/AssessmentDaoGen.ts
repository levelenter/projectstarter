// アセスメントのDAO
import { BaseDao } from "./BaseDao";
import { ResultSetHeader } from 'mysql2';
import { Assessment } from '../dto/Assessment';
export class AssessmentDaoGen extends BaseDao {
  public readonly TABLE_NAME = "assessment";

  // Assessmentを全件取得
  async selectAll(): Promise<Assessment[]> {
    const sql = 'SELECT * FROM assessment ';
    return await this.db.query<Assessment>(sql);
  }
  // Assessmentを主キーで取得
  async selectById(assessment_id: number): Promise<Assessment> {
    const sql = 'SELECT * FROM assessment WHERE  assessment_id = ?  ';
    const params = [assessment_id];
    const results = await this.db.query<Assessment>(sql, params);
    return results[0];
  }
  // Assessmentを主キーで削除
  async deleteById(assessment_id: number): Promise<ResultSetHeader> {
    const sql = 'DELETE FROM assessment WHERE  assessment_id = ?  ';
    const params = [assessment_id];
    return await this.db.execute(sql, params);
  }
  // Assessmentを挿入
  async insert(value: Assessment): Promise<ResultSetHeader> {
    const sql = this.makeInsertSQL('assessment', value);
    const params = this.buildParams(value);
    return await this.db.execute(sql, params);
  }
  // Assessmentを主キーで更新
  async update(value: Assessment): Promise<ResultSetHeader> {
    const keyVo = { assessment_id: value.assessment_id };
    const sql = this.makeUpdateSQL('assessment', keyVo, value);
    const params = this.buildParams(value);
    return await this.db.execute(sql, params);
  }
  // Assessmentを主キーで検索し、なければ挿入、あれば更新
  async insertOrUpdate(entity: Assessment): Promise<ResultSetHeader> {
    return this.insertOrUpdateByObject(this.TABLE_NAME, entity.getPrimaryKeys(), entity);
  }
}

// アセスメントのエンティティ
export class Assessment {
  // アセスメントID DB型(*autokey)
  public assessment_id?: number;
  // ユーザーID DB型(*varchar64)
  public user_id?: string;
  // アセスメント日時 DB型(DATETIME)
  public assessment_time?: Date;
  // 言語 DB型(*varchar64)
  public language_learn?: string;
  // スキルレベル DB型(*varchar64)
  public skill_level?: string;
  // ターゲット DB型(*varchar64)
  public target_learn?: string;
  // 業務内容 DB型(*varchar1024)
  public job_content?: string;
  static fromDB(record: { [column: string]: any; [column: number]: any }): Assessment {
    const entity = new Assessment();
    entity.assessment_id = record['assessment_id'];
    entity.user_id = record['user_id'];
    entity.assessment_time = record['assessment_time'];
    entity.language_learn = record['language_learn'];
    entity.skill_level = record['skill_level'];
    entity.target_learn = record['target_learn'];
    entity.job_content = record['job_content'];
    return entity;
  }
  getPrimaryKeys(): { "assessment_id": number | undefined } {
    const entity = {
    "assessment_id" : this.assessment_id 
    }
    return entity;
  }
  static getTypeFitEntity(value: any): Assessment {
    const entity = new Assessment();
    entity.assessment_id = value.assessment_id;
    entity.user_id = value.user_id;
    entity.assessment_time = value.assessment_time;
    entity.language_learn = value.language_learn;
    entity.skill_level = value.skill_level;
    entity.target_learn = value.target_learn;
    entity.job_content = value.job_content;
    return entity;
  }
}

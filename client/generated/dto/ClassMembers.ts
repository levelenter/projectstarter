// クラスメンバーのエンティティ
export class ClassMembers {
  // クラスユーザーID DB型(INT)
  public user_id?: number;
  // メンバーID DB型(INT)
  public member_id?: number;
  // クラス名 DB型(varchar(100))
  public className?: string;
  // name DB型(varchar(50))
  public name?: string;
  // 最終ログイン日時 DB型()
  public last_login_dt?: any;
  // ログイン回数 DB型(int)
  public login_count?: number;
  // update_dt DB型(datetime on update CURRENT_TIMESTAMP)
  public update_dt?: Date;
  // insert_dt DB型(datetime)
  public insert_dt?: Date;
  // delete_dt DB型(datetime)
  public delete_dt?: Date;
  static fromDB(record: { [column: string]: any; [column: number]: any }): ClassMembers {
    const entity = new ClassMembers();
    entity.user_id = record['user_id'];
    entity.member_id = record['member_id'];
    entity.className = record['className'];
    entity.name = record['name'];
    entity.last_login_dt = record['last_login_dt'];
    entity.login_count = record['login_count'];
    entity.update_dt = record['update_dt'];
    entity.insert_dt = record['insert_dt'];
    entity.delete_dt = record['delete_dt'];
    return entity;
  }
  getPrimaryKeys(): { "user_id": number | undefined,"member_id": number | undefined } {
    const entity = {
    "user_id" : this.user_id 
,
    "member_id" : this.member_id 
    }
    return entity;
  }
  static getTypeFitEntity(value: any): ClassMembers {
    const entity = new ClassMembers();
    entity.user_id = value.user_id;
    entity.member_id = value.member_id;
    entity.className = value.className;
    entity.name = value.name;
    entity.last_login_dt = value.last_login_dt;
    entity.login_count = value.login_count;
    entity.update_dt = value.update_dt;
    entity.insert_dt = value.insert_dt;
    entity.delete_dt = value.delete_dt;
    return entity;
  }
}

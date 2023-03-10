// ユーザーのエンティティ
export class Users {
  // ユーザーID DB型(*varchar64)
  public user_id?: string;
  // name DB型(varchar(50))
  public name?: string;
  // mail DB型(varchar(255))
  public mail?: string;
  // pass DB型(varchar(512))
  public pass?: string;
  // join_time DB型(datetime)
  public join_time?: Date;
  // auth_tags DB型(varchar(50))
  public auth_tags?: string;
  // quite_time DB型(datetime)
  public quite_time?: Date;
  // ログイン回数 DB型(int)
  public login_count?: number;
  // is課金 DB型(*flg)
  public is_purchase?: boolean;
  // プロジェクト上限 DB型(DOUBLE)
  public limit_project?: any;
  // 最終ログイン日時 DB型(datetime on update CURRENT_TIMESTAMP)
  public last_login_dt?: Date;
  // 有効期限最終日時 DB型(TIMESTAMP)
  public datetime_expiry?: Date;
  // is_recieve_mail DB型(char(1))
  public is_recieve_mail?: string;
  // oauth_uid DB型(varchar(100))
  public oauth_uid?: string;
  // update_dt DB型(datetime on update CURRENT_TIMESTAMP)
  public update_dt?: Date;
  // insert_dt DB型(datetime)
  public insert_dt?: Date;
  // delete_dt DB型(datetime)
  public delete_dt?: Date;
  static fromDB(record: { [column: string]: any; [column: number]: any }): Users {
    const entity = new Users();
    entity.user_id = record['user_id'];
    entity.name = record['name'];
    entity.mail = record['mail'];
    entity.pass = record['pass'];
    entity.join_time = record['join_time'];
    entity.auth_tags = record['auth_tags'];
    entity.quite_time = record['quite_time'];
    entity.login_count = record['login_count'];
    entity.is_purchase = record['is_purchase'];
    entity.limit_project = record['limit_project'];
    entity.last_login_dt = record['last_login_dt'];
    entity.datetime_expiry = record['datetime_expiry'];
    entity.is_recieve_mail = record['is_recieve_mail'];
    entity.oauth_uid = record['oauth_uid'];
    entity.update_dt = record['update_dt'];
    entity.insert_dt = record['insert_dt'];
    entity.delete_dt = record['delete_dt'];
    return entity;
  }
  getPrimaryKeys(): { "user_id": string | undefined } {
    const entity = {
    "user_id" : this.user_id 
    }
    return entity;
  }
  static getTypeFitEntity(value: any): Users {
    const entity = new Users();
    entity.user_id = value.user_id;
    entity.name = value.name;
    entity.mail = value.mail;
    entity.pass = value.pass;
    entity.join_time = value.join_time;
    entity.auth_tags = value.auth_tags;
    entity.quite_time = value.quite_time;
    entity.login_count = value.login_count;
    entity.is_purchase = value.is_purchase;
    entity.limit_project = value.limit_project;
    entity.last_login_dt = value.last_login_dt;
    entity.datetime_expiry = value.datetime_expiry;
    entity.is_recieve_mail = value.is_recieve_mail;
    entity.oauth_uid = value.oauth_uid;
    entity.update_dt = value.update_dt;
    entity.insert_dt = value.insert_dt;
    entity.delete_dt = value.delete_dt;
    return entity;
  }
}

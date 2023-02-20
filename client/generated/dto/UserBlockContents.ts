// user_block_contentsのエンティティ
export class UserBlockContents {
  // ユーザブロックコンテンツID DB型(int auto_increment)
  public user_block_contents_id?: number;
  // マスターID DB型(varchar(30))
  public project_id?: string;
  // ユーザID DB型(int)
  public user_id?: number;
  // メンバーID DB型(int)
  public member_id?: number;
  // title DB型(varchar(255))
  public title?: string;
  // ブロックプログラム DB型(mediumtext)
  public block_xml?: string;
  // ブロックのコード DB型(mediumtext)
  public block_code?: string;
  // js_code DB型(mediumtext)
  public js_code?: string;
  // is_publish DB型(tinyint)
  public is_publish?: number;
  // is_group_publish DB型(tinyint)
  public is_group_publish?: number;
  // likeCount DB型(int)
  public likeCount?: number;
  // version_no DB型(int)
  public version_no?: number;
  // 挿入日時 DB型(datetime)
  public insert_dt?: Date;
  // 更新日時 DB型(datetime on update CURRENT_TIMESTAMP)
  public update_dt?: Date;
  // 削除日時 DB型(datetime)
  public delete_dt?: Date;
  static fromDB(record: { [column: string]: any; [column: number]: any }): UserBlockContents {
    const entity = new UserBlockContents();
    entity.user_block_contents_id = record['user_block_contents_id'];
    entity.project_id = record['project_id'];
    entity.user_id = record['user_id'];
    entity.member_id = record['member_id'];
    entity.title = record['title'];
    entity.block_xml = record['block_xml'];
    entity.block_code = record['block_code'];
    entity.js_code = record['js_code'];
    entity.is_publish = record['is_publish'];
    entity.is_group_publish = record['is_group_publish'];
    entity.likeCount = record['likeCount'];
    entity.version_no = record['version_no'];
    entity.insert_dt = record['insert_dt'];
    entity.update_dt = record['update_dt'];
    entity.delete_dt = record['delete_dt'];
    return entity;
  }
  getPrimaryKeys(): { "user_block_contents_id": number | undefined } {
    const entity = {
    "user_block_contents_id" : this.user_block_contents_id 
    }
    return entity;
  }
  static getTypeFitEntity(value: any): UserBlockContents {
    const entity = new UserBlockContents();
    entity.user_block_contents_id = value.user_block_contents_id;
    entity.project_id = value.project_id;
    entity.user_id = value.user_id;
    entity.member_id = value.member_id;
    entity.title = value.title;
    entity.block_xml = value.block_xml;
    entity.block_code = value.block_code;
    entity.js_code = value.js_code;
    entity.is_publish = value.is_publish;
    entity.is_group_publish = value.is_group_publish;
    entity.likeCount = value.likeCount;
    entity.version_no = value.version_no;
    entity.insert_dt = value.insert_dt;
    entity.update_dt = value.update_dt;
    entity.delete_dt = value.delete_dt;
    return entity;
  }
}

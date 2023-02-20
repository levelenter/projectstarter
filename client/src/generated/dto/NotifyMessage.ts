// 通知メッセージのエンティティ
export class NotifyMessage {
  // 通知ID DB型(*autokey)
  public notify_id?: number;
  // タイトル DB型(*varchar256)
  public title?: string;
  // 通知メッセージ DB型(*varchar1024)
  public notify_message?: string;
  // 通知日時 DB型(@DATETIME)
  public notify_dt?: Date;
  static fromDB(record: { [column: string]: any; [column: number]: any }): NotifyMessage {
    const entity = new NotifyMessage();
    entity.notify_id = record['notify_id'];
    entity.title = record['title'];
    entity.notify_message = record['notify_message'];
    entity.notify_dt = record['notify_dt'];
    return entity;
  }
  getPrimaryKeys(): { "notify_id": number | undefined } {
    const entity = {
    "notify_id" : this.notify_id 
    }
    return entity;
  }
  static getTypeFitEntity(value: any): NotifyMessage {
    const entity = new NotifyMessage();
    entity.notify_id = value.notify_id;
    entity.title = value.title;
    entity.notify_message = value.notify_message;
    entity.notify_dt = value.notify_dt;
    return entity;
  }
}

export class UserInSession {
  public user_id = "";
  // name DB型(varchar(50))
  public name?: string = "";
  // mail DB型(varchar(255))
  public mail?: string = "";
  // join_time DB型(datetime)
  public join_time?: Date = new Date();
  // auth_tags DB型(varchar(50))
  public auth_tags?: string = "";

  public token = "";
}

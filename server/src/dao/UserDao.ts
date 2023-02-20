import { ResultSetHeader } from 'mysql2';
import { UsersDaoGen } from '../../generated/dao/UsersDaoGen';
import { Users } from '../../generated/dto/Users';

export class UsersDao extends UsersDaoGen {
  async loginCheck(mail: string, hash: string): Promise<Users[]> {
    const sql = 'SELECT * FROM users WHERE mail = ? AND pass = ? AND delete_dt IS NULL';
    return this.db.query<Users>(sql, [mail, hash]);
  }

  async loginCheckV1(mail: string, password: string): Promise<Users[]> {
    const sql =
      "SELECT * FROM users WHERE mail = ? AND lcase(pass) = concat('*',sha1( UNHEX(SHA1(?)) )) AND delete_dt IS NULL";
    return this.db.query(sql, [mail, password]);
  }

  async updateLoginCount(login_count: number, user_id: number): Promise<ResultSetHeader> {
    const sql = 'UPDATE users SET login_count = ? WHERE user_id = ? ';
    return this.db.execute(sql, [login_count, user_id]);
  }

  async getUserByMail(mail: string): Promise<Users[]> {
    const sql = 'SELECT * FROM users WHERE mail = ? ';
    return this.db.query(sql, [mail]);
  }

  async getUserByUserId(user_id: number): Promise<Users[]> {
    const sql = 'SELECT * FROM users WHERE user_id = ? ';
    return this.db.query(sql, [user_id]);
  }

  async getUserByOauthId(uid: string): Promise<Users[]> {
    const sql = 'SELECT * FROM users WHERE oauth_uid = ? ';
    return this.db.query(sql, [uid]);
  }

  async insertUser(
    name: string,
    mail: string,
    hash: string,
    auth_tags: string,
    belong_to: string,
    oauth_uid: string
  ): Promise<ResultSetHeader> {
    const insert_sql =
      'insert into users (name,mail,pass,auth_tags,belong_to,oauth_uid) values (?,?, ? ,?,? ,?)';
    return this.db.execute(insert_sql, [name, mail, hash, auth_tags, belong_to, oauth_uid]);
  }

  async updatePassV2(user_id: number, new_hash: string): Promise<ResultSetHeader> {
    const sql = ` update users set 
     pass = ? , 
     pass = null 
     where user_id = ? `;
    return this.db.execute(sql, [new_hash, user_id]);
  }
}

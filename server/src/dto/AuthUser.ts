import { Users } from '../../generated/dto/Users';
export class AuthUser {
  static NO_CLASS_MEMBER = -1;
  user_id: number;
  user_name: string;
  auth_tags: string;
  member_id: number;
  member_name: string;
  token: string;

  /**
   * ユーザーデータから認証ユーザを作るFactory
   * @param u
   * @param token
   * @param member_id デフォルトはNO_CLASS_MEMBER。クラスルームに入っていると1以上
   * @returns
   */
  static fromUser(
    u: Users,
    token: string,
    member_id = this.NO_CLASS_MEMBER,
    member_name = ''
  ): AuthUser {
    const auth = new AuthUser();
    auth.user_id = u.user_id!;
    auth.user_name = u.name!;
    auth.auth_tags = u.auth_tags!;
    auth.token = token;
    auth.member_id = member_id;
    auth.member_name = member_name;
    return auth;
  }
}

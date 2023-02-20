import { PoolConnection } from 'mysql2/promise';
import { Transactional } from '../../framework/lib/@Transactional';
import { Rest } from '../../framework/lib/@Rest';
import { Response } from '../../framework/lib/Response';
import crypto from 'crypto';

import { Users } from '../../dist/dto/Users';


export class AuthService {
  connection!: PoolConnection;

  /**
   * パスワードをハッシュ化する
   * @param password パスワード
   * @returns
   */
  static hashPassword(password: string): string {
    const sha512 = crypto.createHash('sha512');
    sha512.update(password);
    const hash = sha512.digest('base64');
    return hash;
  }

  /**
   * 認証トークンを作成して返す
   * @param name
   * @param userId
   * @returns
   */
  createJwtToken(name: string, userId: number): string {
    // 認証トークンを作成以後、APIアクセスにはトークンが必要

    return "token";
  }

  async onLoginSuccess(user: Users, con: PoolConnection): Promise<void> {

  }

  @Rest('/v1/AuthService/classRoomLogin', 'post', false)
  @Transactional('connection')
  async classRoomLogin(user_id: number, member_id: number): Promise<Response<string>> {
    return new Response<string>("authUser");
  }

  @Rest('/v1/AuthService/forceLogin', 'post', true)
  @Transactional('connection')
  async forceLogin(mail: string): Promise<Response<string>> {
    console.log('login', mail);
    return new Response("test")
  }
}

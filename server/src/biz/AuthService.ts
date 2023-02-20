
import jwt from 'jsonwebtoken';
import { PoolConnection } from 'mysql2/promise';
import crypto from 'crypto';
// import { UsersDao } from '../dao/UsersDao';
// import { RecoverableError } from '../../framework/biz/RecoverableError';
// import { AuthUser } from '../dto/AuthUser';
// import { Users } from '../dto/generated/Users';
// import { OAuthResult } from '../dto/OAuthResult';

// import * as fs from 'fs';
// import path from 'path';
import { Response } from './generated/Response';
import { Transactional } from '../../../framework/lib/@Transactional';
import { Rest } from '../../../framework/lib/@Rest';
import config from 'config';
import { Users } from '../generated/dto/Users';
import { UsersDao } from '../dao/UserDao';
import { RecoverableError } from '../../../framework/lib/RecoverableError';
import { AuthUser } from '../dto/AuthUser';

// const PRIVATEKEY = fs.readFileSync(
//   path.join(process.cwd(), './__dev/authentication/rsa-private.pem')
// );

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
    // const algorithm: Algorithm = 'RS256';
    // const options: SignOptions = {
    //   // algorithm: algorithm,
    //   expiresIn: '12h',
    //   subject: 'Access Token',
    // };
    const payload = {
      name: name,
      userId: userId,
    };
    // const token = jwt.sign(payload, PRIVATEKEY, options);
    // const token = jwt.sign(payload, options);

    const token = jwt.sign(payload, config.get('secret'), {
      expiresIn: '12h',
    }); // 第1引数のpayloadに、MySQLのresultsはNG
    return token;
  }

  async onLoginSuccess(user: Users, con: PoolConnection): Promise<void> {
    // ログインカウントを更新
    const login_count = user.login_count ? user.login_count + 1 : 1;
    const dao = new UsersDao(con);
    try {
      await dao.updateLoginCount(login_count, user.user_id!);
    } catch (error) {
      console.error('ログインカウントの更新に失敗');
      throw error;
    }
  }

  @Rest('/v1/AuthService/forceLogin', 'post', true)
  @Transactional('connection')
  async forceLogin(mail: string): Promise<Response<AuthUser>> {
    console.log('login', mail);

    const dao = new UsersDao(this.connection);
    const results = await dao.getUserByMail(mail);
    const user = results[0];
    if (!user) throw new RecoverableError('メールアドレスが間違っています');
    console.log('force login user', user);
    await this.onLoginSuccess(user, this.connection);
    const authUser = AuthUser.fromUser(user, this.createJwtToken(user.name!, user.user_id!));
    return new Response<AuthUser>(authUser);
  }

  @Rest('/v1/AuthService/login', 'get', false)
  @Transactional('connection')
  async login(mail: string, password: string): Promise<Response<AuthUser>> {
    console.log('login', mail, password);

    const hash = AuthService.hashPassword(password);
    const dao = new UsersDao(this.connection);
    const results = await dao.loginCheck(mail, hash);
    let user = results[0];
    if (!user) {
      // V2用のログインができないなら、V1でログイン
      const v1Results = await dao.loginCheckV1(mail, password);
      user = v1Results[0];
      if (!user)
        throw new RecoverableError('メールアドレスまたはパスワードが間違っています[v1 try]');
    }
    console.log('login user', user);
    await this.onLoginSuccess(user, this.connection);
    const authUser = AuthUser.fromUser(user, this.createJwtToken(user.name!, user.user_id!));
    return new Response<AuthUser>(authUser);
  }

  /**
   * アカウント作成、認証フィルタはかからない
   * user/createAccount
   * userApi.createAccount このメソッド内でtoken発行まで実施
   */
  @Rest('/v1/AuthService/createUserApi', 'post', false)
  @Transactional('connection')
  async createUserApi(
    mail: string,
    password: string,
    create_name: string,
    auth_tags: string,
    belong_to: string
  ): Promise<Response<AuthUser>> {
    // メールアドレスが入力されていない
    if (!mail) throw new RecoverableError('メールアドレスを入力してください');

    const dao = new UsersDao(this.connection);
    const results = await dao.getUserByMail(mail);

    // メールアドレスチェック
    if (results.length > 0) throw new RecoverableError('すでに存在するメールアドレスです。');
    const hash = AuthService.hashPassword(password);

    const resultInsert = await dao.insertUser(create_name, mail, hash, auth_tags, belong_to, "");
    const userId = resultInsert.insertId;
    const authUser = new AuthUser();
    authUser.user_id = resultInsert.insertId;
    authUser.user_name = create_name;
    authUser.auth_tags = auth_tags;
    authUser.token = this.createJwtToken(create_name, userId);
    return new Response<AuthUser>(authUser);
  }
}

import jwt from "jsonwebtoken";
import { PoolConnection } from "mysql2/promise";
import crypto from "crypto";
import { Response } from "./generated/Response";
import { Transactional } from "./generated/@Transactional";
import { Rest } from "./generated/@Rest";
import { Users } from "../generated/dto/Users";
import { UsersDao } from "../dao/UserDao";
import { RecoverableError } from "./generated/RecoverableError";
import { AuthUser } from "../dto/AuthUser";
import { uuid } from "uuidv4";
import { ConnectionFactory } from "./generated/ConnectionFactory";

export class AuthService {
  connection!: PoolConnection;

  /**
   * パスワードをハッシュ化する
   * @param password パスワード
   * @returns
   */
  static hashPassword(password: string): string {
    const sha512 = crypto.createHash("sha512");
    sha512.update(password);
    const hash = sha512.digest("base64");
    return hash;
  }

  /**
   * 認証トークンを作成して返す
   * @param name
   * @param userId
   * @returns
   */
  createJwtToken(name: string, userId: string): string {
    // 認証トークンを作成以後、APIアクセスにはトークンが必要
    const payload = {
      name: name,
      userId: userId,
    };
    const PRIVATEKEY = "levelenter!!";
    const token = jwt.sign(payload, PRIVATEKEY, {
      algorithm: "HS256", //RS256 // RSだと公開鍵と秘密鍵が必要
      expiresIn: "2h",
      subject: "Access Token",
    });
    return token;
  }

  async onLoginSuccess(user: Users, con: PoolConnection): Promise<void> {
    // ログインカウントを更新
    const login_count = user.login_count ? user.login_count + 1 : 1;
    const dao = new UsersDao(con);
    try {
      await dao.updateLoginCount(login_count, user.user_id!);
    } catch (error) {
      console.error("ログインカウントの更新に失敗");
      throw error;
    }
  }

  @Rest("/v1/AuthService/getLoginUserInfo", "get", true)
  @Transactional("connection")
  async getLoginUserInfo(mail: string): Promise<Response<AuthUser>> {
    // const dao = new UsersDao(this.connection);
    // const results = await dao.getUserByMail(mail);
    // const user = results[0];
    // if (!user) throw new RecoverableError('メールアドレスが間違っています');
    // const authUser = AuthUser.fromUser(user, this.createJwtToken(user.name!, user.user_id!));
    return new Response<any>({ ok: "ok" });
  }

  @Rest("/v1/AuthService/forceLogin", "post", true)
  @Transactional("connection")
  async forceLogin(mail: string): Promise<Response<AuthUser>> {
    console.log("login", mail);

    const dao = new UsersDao(this.connection);
    const results = await dao.getUserByMail(mail);
    const user = results[0];
    if (!user) throw new RecoverableError("メールアドレスが間違っています");
    console.log("force login user", user);
    await this.onLoginSuccess(user, this.connection);
    const authUser = AuthUser.fromUser(
      user,
      this.createJwtToken(user.name!, user.user_id!)
    );
    return new Response<AuthUser>(authUser);
  }

  message = "";

  @Rest("/v1/AuthService/login", "get", false)
  @Transactional("connection")
  async login(mail: string, password: string): Promise<Response<AuthUser>> {
    try {
      console.log("login", mail, password);

      const hash = AuthService.hashPassword(password);
      const dao = new UsersDao(this.connection);
      const results = await dao.loginCheck(mail, hash);
      let user = results[0];
      if (!user) {
        console.log("メールアドレスまたはパスワードが間違っています");
        throw new RecoverableError(
          "メールアドレスまたはパスワードが間違っています"
        );
      }
      console.log("login user", user);
      await this.onLoginSuccess(user, this.connection);
      const authUser = AuthUser.fromUser(
        user,
        this.createJwtToken(user.name!, user.user_id!)
      );
      return new Response<AuthUser>(authUser);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  /**
   * アカウント作成、認証フィルタはかからない
   * user/createAccount
   * userApi.createAccount このメソッド内でtoken発行まで実施
   */
  @Rest("/v1/AuthService/createUserApi", "post", false)
  @Transactional("connection")
  async createUserApi(
    mail: string,
    password: string,
    create_name: string,
    auth_tags: string
  ): Promise<Response<AuthUser>> {
    // メールアドレスが入力されていない
    if (!mail) throw new RecoverableError("メールアドレスを入力してください");

    const dao = new UsersDao(this.connection);
    const results = await dao.getUserByMail(mail);

    // メールアドレスチェック
    if (results.length > 0)
      throw new RecoverableError("すでに存在するメールアドレスです。");
    const hash = AuthService.hashPassword(password);

    const user_id = uuid();
    await dao.insertUser(user_id, create_name, mail, hash, auth_tags, "");
    const authUser = new AuthUser();
    authUser.user_id = user_id;
    authUser.user_name = create_name;
    authUser.auth_tags = auth_tags;
    authUser.token = this.createJwtToken(create_name, user_id);
    return new Response<AuthUser>(authUser);
  }
}

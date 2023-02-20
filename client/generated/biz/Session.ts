import { MessageDialog } from './MessageDialog';
// import jwt from 'jsonwebtoken';

type SESSION_KEYS = 'session_user' | 'skechfab_code';

export class Session {
  static logout() {
    sessionStorage.clear();
  }
  static timeout() {
    sessionStorage.clear();
    MessageDialog.alert('セッションタイムアウトしました');
    location.reload();
  }

  static reAuthorize() {
    sessionStorage.clear();
    MessageDialog.alert('もう一度認証してください');
    location.reload();
  }

  static get isAuthorized(): boolean {
    const user = this.get<string>('session_user');
    if (!user) return false;
    return true;
  }

  /**
   *
   * @param key SESSION_KEYSに限定
   * @param val
   */
  static set<T>(key: SESSION_KEYS, val: T) {
    //valがobjならJSON化する
    if (val instanceof Object) {
      sessionStorage.setItem(key, JSON.stringify(val));
    } else {
      //存在するキーがあれば上書きする
      sessionStorage.setItem(key, `${val}`);
    }
  }

  static isExist(key: SESSION_KEYS): boolean {
    const data = sessionStorage.getItem(key);
    return data ? true : false;
  }

  static get<T>(key: SESSION_KEYS): T | null {
    const rawValue = sessionStorage.getItem(key);
    if (rawValue) {
      try {
        const item: T = JSON.parse(rawValue) as T;
        return item;
      } catch (error) {
        return rawValue as any;
      }
    } else {
      return null;
    }
  }

  static getSessionUser() {
    const token = Session.getSessionToken();
    const user = {}; // jwt.decode(token);
    return user;
  }

  static getSessionToken() {
    const user = Session.get<any>('session_user');
    if (!user) return {};
    return user;
  }

  static getJwtToken(): string {
    return this.getSessionToken();
  }

  static toString(): string {
    const user = Session.getSessionUser();
    return JSON.stringify(user);
  }
}

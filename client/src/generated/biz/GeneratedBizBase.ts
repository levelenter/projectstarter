import Axios, { AxiosInstance } from 'axios';
import { Response } from './Response';
import { Session } from './Session';
import { restCallApi ,getApiHost } from './restCallApi';

export class GeneratedBizBase {
  private _token!: string;

  public static getApiHost = () =>  getApiHost()

  // ユニットテスト時にSessionからトークンが取れないためインジェクトしてからやる
  get token(): string {
    if (!this._token || typeof this._token === 'undefined') {
      // ユニットテスト環境では、Sessionをとれない
      this._token = Session.getJwtToken();
    }
    return this._token;
  }

  set token(value: string) {
    this._token = value;
  }
  private _axios!: AxiosInstance;

  // ユニットテスト時にSessionからトークンが取れないためインジェクトしてからやる
  get axios(): AxiosInstance {
    if (!this._axios) {
      this._axios = Axios;
    }
    return this._axios;
  }

  set axios(value: AxiosInstance) {
    this._axios = value;
  }

  // restCall を委譲
  protected async restCall<T extends Response<any>>(
    method: 'get' | 'post' | 'put' | 'delete',
    path: string,
    sendData: any
  ): Promise<T> {
    const token = Session.getJwtToken()
    // const tokenString = this.token
    return  restCallApi<T>(method, path, sendData, token )
  }
}

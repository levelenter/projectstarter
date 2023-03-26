type AuthUser = any;


import { GeneratedBizBase } from '../GeneratedBizBase';


import type { Response } from '../Response';
const getHost = ()=>{return location.hostname === "localhost" ? "http://localhost:8888/" : "https://on-boarding.com/api/" } 

export class AuthService extends GeneratedBizBase{
  async getLoginUserInfo(mail: string): Promise<Response<AuthUser>> {
    return super.restCall<Response<AuthUser>>('get', getHost() + '/v1/AuthService/getLoginUserInfo', arguments);
  }
  async forceLogin(mail: string): Promise<Response<AuthUser>> {
    return super.restCall<Response<AuthUser>>('post', getHost() + '/v1/AuthService/forceLogin', arguments);
  }
  async login(mail: string,password: string): Promise<Response<AuthUser>> {
    return super.restCall<Response<AuthUser>>('get', getHost() + '/v1/AuthService/login', arguments);
  }
  async createUserApi(mail: string,password: string,create_name: string,auth_tags: string): Promise<Response<AuthUser>> {
    return super.restCall<Response<AuthUser>>('post', getHost() + '/v1/AuthService/createUserApi', arguments);
  }
}

type AuthUser = any;


import { GeneratedBizBase } from '../GeneratedBizBase';


import type { Response } from '../Response';export class AuthService extends GeneratedBizBase{
  async forceLogin(mail: string): Promise<Response<AuthUser>> {
    return super.restCall<Response<AuthUser>>('post', '/v1/AuthService/forceLogin', arguments);
  }
  async login(mail: string,password: string): Promise<Response<AuthUser>> {
    return super.restCall<Response<AuthUser>>('get', '/v1/AuthService/login', arguments);
  }
  async createUserApi(mail: string,password: string,create_name: string,auth_tags: string,belong_to: string): Promise<Response<AuthUser>> {
    return super.restCall<Response<AuthUser>>('post', '/v1/AuthService/createUserApi', arguments);
  }
}

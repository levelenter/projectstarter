import { GeneratedBizBase } from '../GeneratedBizBase';


import { Response } from '../Response';export class AuthService extends GeneratedBizBase{
  async classRoomLogin(user_id: number,member_id: number): Promise<Response<string>> {
    return super.restCall<Response<string>>('post', '/v1/AuthService/classRoomLogin', arguments);
  }
  async forceLogin(mail: string): Promise<Response<string>> {
    return super.restCall<Response<string>>('post', '/v1/AuthService/forceLogin', arguments);
  }
}

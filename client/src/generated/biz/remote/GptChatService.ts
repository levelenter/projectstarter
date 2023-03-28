import { GeneratedBizBase } from '../GeneratedBizBase';


import type { Response } from '../Response';
export class GptChatService extends GeneratedBizBase{
  async sendMessage(message: string): Promise<Response<any>> {
    return super.restCall<Response<any>>('post', GeneratedBizBase.getApiHost() + '/v1/GptChatService/sendMessage', arguments);
  }
}

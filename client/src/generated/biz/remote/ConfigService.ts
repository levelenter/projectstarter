import { GeneratedBizBase } from '../GeneratedBizBase';


import type { Response } from '../Response';
export class ConfigService extends GeneratedBizBase{
  async get(): Promise<Response<any>> {
    return super.restCall<Response<any>>('get', GeneratedBizBase.getHost() + '/v1/ConfigService/get', arguments);
  }
}

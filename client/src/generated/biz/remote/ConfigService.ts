import { GeneratedBizBase } from '../GeneratedBizBase';


import type { Response } from '../Response';
const getHost = ()=>{return location.hostname === "localhost" ? "http://localhost:8888/" : "https://on-boarding.com/api/" } 

export class ConfigService extends GeneratedBizBase{
  async get(): Promise<Response<any>> {
    return super.restCall<Response<any>>('get', getHost() + '/v1/ConfigService/get', arguments);
  }
}

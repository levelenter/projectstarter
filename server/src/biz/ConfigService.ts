import { Rest } from "./generated/@Rest";
import { ConfigDTO } from "../dto/ConfigDTO";
import { Response } from "./generated/Response";
import config from 'config';

export class ConfigService {
  @Rest('/v1/ConfigService/get', 'get', true)
  async get(): Promise<Response<any>> {
    const configObject = new ConfigDTO()
    configObject.host = config.get<string>("server_host");
    configObject.port = config.get<string>("server_port");
    return new Response<ConfigDTO>(configObject);
  }
}
export class ClientConfig{
  host = "";
  port = 80;
  static instance(){
    const config = new ClientConfig();
    config.host = "";
    config.port = 8080;
    return config;
  }

}
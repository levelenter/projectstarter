import generatedConfig from "../generatedConfig.json";

export const config =  generatedConfig;

export const getHost = () => {return location.hostname === "localhost" ? config.hosts.development :  config.hosts.production } 

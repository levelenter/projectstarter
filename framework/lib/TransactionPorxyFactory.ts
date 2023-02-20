import { PoolConnection } from "mysql2/promise";
import { ConnectionFactory } from "./ConnectionFactory";

class TransactionProxyFactory {
  static build<T>(object: any, propagation: "always" | "none" = "always") {
    return new Proxy(object, {
      get: async function(target, prop, receiver) {
        if (prop === "connection") {
          return await new ConnectionFactory().getConnection();
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }
}

import { ConnectionFactory } from './ConnectionFactory';
import { PoolConnection } from 'mysql2/promise';

// 非同期メソッド型を取り出す
const AsyncFunction = (async () => {
  /**/
}).constructor;

// export type PropagationType = "always" | "none";
const stack: string[] = [];

export function Transactional(
  conPropertyName: string
  // ,propagation: PropagationType = "always"
) {
  // console.log('Transactional(): evaluated');

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // console.log("Transactional(): called", target, propertyKey);
    // console.log(descriptor.value instanceof AsyncFunction);

    console.assert(descriptor.value instanceof AsyncFunction, '@Transactionalアノテーションは非同期メソッドに対してのみ実装可能です');

    // デコレーターが設定された関数を origin に保存
    const origin = descriptor.value;

    // 関数を書き換える
    descriptor.value = async function (...args: any[]) {
      // console.log("decorate before!");

      target[conPropertyName] = await new ConnectionFactory().getConnection();
      // console.log("before start transaction!");
      target[conPropertyName].beginTransaction();
      // console.log("after start transaction!");

      // target.threadId = 1;
      stack.push('threadId', target[conPropertyName].threadId);

      // console.log(stack);
      // 元の関数を呼ぶ

      let result;
      try {
        result = origin.apply(this, args);

        target[conPropertyName].commit();
      } catch (e) {
        target[conPropertyName].rollback();
        throw e;
      } finally {
        target[conPropertyName].release();
      }
      return result;
    };
  };
}

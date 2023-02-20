// 非同期メソッド型を取り出す
const AsyncFunction = (async () => {
  // console.log('');
}).constructor;

export function Rest(uri: string, method: 'get' | 'post' | 'delete' | 'put', riquireToekn = true) {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor): void {
    console.assert(
      descriptor.value instanceof AsyncFunction,
      '@Restアノテーションは非同期メソッドに対してのみ実装可能です'
    );

    // デコレーターが設定された関数を origin に一旦保存
    const origin = descriptor.value;

    // 関数を書き換える
    descriptor.value = async function (...args: any[]) {
      // 元の関数を呼ぶ
      const result = origin.apply(this, args);
      return result;
    };
  };
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rest = void 0;
// 非同期メソッド型を取り出す
const AsyncFunction = (async () => {
    // console.log('');
}).constructor;
function Rest(uri, method, riquireToekn = true) {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    return function (target, propertyKey, descriptor) {
        console.assert(descriptor.value instanceof AsyncFunction, '@Restアノテーションは非同期メソッドに対してのみ実装可能です');
        // デコレーターが設定された関数を origin に一旦保存
        const origin = descriptor.value;
        // 関数を書き換える
        descriptor.value = async function (...args) {
            // 元の関数を呼ぶ
            const result = origin.apply(this, args);
            return result;
        };
    };
}
exports.Rest = Rest;
//# sourceMappingURL=@Rest.js.map
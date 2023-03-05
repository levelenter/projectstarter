"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transactional = void 0;
const ConnectionFactory_1 = require("./ConnectionFactory");
// 非同期メソッド型を取り出す
const AsyncFunction = (async () => {
    /**/
}).constructor;
// export type PropagationType = "always" | "none";
const stack = [];
function Transactional(conPropertyName
// ,propagation: PropagationType = "always"
) {
    // console.log('Transactional(): evaluated');
    return function (target, propertyKey, descriptor) {
        // console.log("Transactional(): called", target, propertyKey);
        // console.log(descriptor.value instanceof AsyncFunction);
        console.assert(descriptor.value instanceof AsyncFunction, '@Transactionalアノテーションは非同期メソッドに対してのみ実装可能です');
        // デコレーターが設定された関数を origin に保存
        const origin = descriptor.value;
        // 関数を書き換える
        descriptor.value = async function (...args) {
            // console.log("decorate before!");
            target[conPropertyName] = await new ConnectionFactory_1.ConnectionFactory().getConnection();
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
            }
            catch (e) {
                target[conPropertyName].rollback();
                throw e;
            }
            finally {
                target[conPropertyName].release();
            }
            return result;
        };
    };
}
exports.Transactional = Transactional;
//# sourceMappingURL=@Transactional.js.map
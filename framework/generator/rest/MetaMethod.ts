import { MetaParam } from './MetaParam';
import { Primitive, findClassDef } from './common';

import { getGenericTypeArgType, isGenericType, trimQuate } from './restUtil';

const frameWorkBizDir = "../";

const refDistDto = "../../dto"
/**
 * メソッドのメタ情報を蓄積する
 */
export class MetaMethod {
  public name = '';
  public uri = '';
  public params: MetaParam[] = [];
  public httpMethod = '';
  public returnType = '';
  public requireToken = 'true';

  get isRequireToken() {
    return this.requireToken === 'true';
  }

  /**
   * トークンのチェックを免除している文字列を出す
   */
  public get ignoredString() {
    // トークンを免除されている場合リストに追加
    if (!this.isRequireToken) {
      return `  { uri: ${this.uri}, httpMethod: ${this.httpMethod} }, `;
    } else {
      return '';
    }
  }

  /**
   * ''によるクオートを外したhttpMethod
   */
  get httpMethodNoQuote() {
    return trimQuate(this.httpMethod);
  }

  /**
   * URIのクォートを除外
   */
  get uriNoQuate() {
    return trimQuate(this.uri);
  }

  /**
   * Restデコレーターの指定ミスをチェック
   */
  checkRestDecoretor(className: string): boolean {
    let hasError = false;
    if (!this.isRestDecorated) return hasError;
    if (!this.uriNoQuate.startsWith('/')) {
      console.error(
        `REST指定エラー uriは/から始めてください${className}#${this.name} : ${this.uriNoQuate}`
      );
      hasError = true;
    }
    return hasError;
  }

  /**
   * "@Rest"で装飾されたメソッドであるかを返す
   */
  public isRestDecorated = false;

  /**
   * 戻り値型の「Promise」の文字列を外す
   */
  public get notPromiseReturnType() {
    if (!this.returnType || this.returnType.indexOf('Promise') < 0) {
      return this.returnType;
    }
    return this.returnType.replace('Promise<', '').replace('>', '');
  }

  /**
   * クライアントプロキシのメソッドを作成する
   */
  toClientDefString(): string {
    if (!this.isRestDecorated) return '';
    let str = '';
    str += `  async ${this.name}(${this.params.map((p) => p.toClientDefString()).join(',')}): ${
      this.returnType
    } {\n`;
    str += `    return super.restCall<${this.notPromiseReturnType}>`;
    str += `(${this.httpMethod}, ${this.uri}, arguments);\n`;
    str += `  }\n`;
    return str;
  }

  /**
   * メソッドごとにRestのルーティングを作成する
   * @param className
   */
  toExpressRoutingString(className: string): string {
    if (!this.isRestDecorated) return '';

    const paramObjectName = this.httpMethodNoQuote === 'get' ? 'req.query' : 'req.body';
    let count = 0;
    const paramString = this.params.map((p) => p.toRestString(paramObjectName, count++)).join(',');
    const paramNames = this.params.map((p) => p.toParamNamesArrayString()).join(',');
    let str = '';
    str += `generatedRest.${this.httpMethodNoQuote}(${this.uri},\n`;
    str += `async (req: express.Request, res: express.Response) => {\n`;
    str += `  const biz = new ${className}();\n`;
    str += `  try{\n`;
    str += `    tokenHandler(req, ${this.isRequireToken}, [${paramNames}] );\n`;
    str += `    const result = await biz.${this.name}(${paramString});\n`;
    str += `    res.send(result);\n`;
    str += `  } catch(error) {\n`;
    str += `    errorHandler(res, error as any);\n`;
    str += `  }\n`;
    str += `});\n\n`;
    return str;
  }

  /**
   * 引数の型をインポート文にする
   */
  get paramDefImportStringArray() {
    const paramTypes = this.params.map((p) => {
      // プリミティブな型だったらインポートはいらない
      const noArrayType = p.type.replace('[]', '');
      if (Primitive.includes(noArrayType)) return '';

      let importSentence = '';
      const classDefType = findClassDef(p.typeWithoutArray);
      if (classDefType === 'entity') {
        importSentence = `import { ${p.typeWithoutArray} } from '${refDistDto}/${p.typeWithoutArray}';`;
      } else if (classDefType === 'dto') {
        importSentence = `import { ${p.typeWithoutArray} } from '${refDistDto}/${p.typeWithoutArray}';`;
      } else {
        throw new Error(
          `${this.name}の引数${p.name}で、/entityまたは/entity/generated、/param以外のオブジェクトは指定できません。`
        );
      }
      return importSentence;
    });
    return paramTypes;
  }

  /**
   * 引数の型をインポート文にする(Serverside)
   */
  get paramDefImportStringArrayForExpress() {
    const paramTypes = this.params.map((p) => {
      // プリミティブな型だったらインポートはいらない
      const noArrayType = p.type.replace('[]', '');
      if (Primitive.includes(noArrayType)) return '';

      let importSentence = '';
      const classDefType = findClassDef(p.typeWithoutArray);
      if (classDefType === 'entity') {
        importSentence = `import { ${p.typeWithoutArray} } from '${refDistDto}/${p.typeWithoutArray}';`;
      } else if (classDefType === 'dto') {
        importSentence = `import { ${p.typeWithoutArray} } from '${refDistDto}/${p.typeWithoutArray}';`;
      } else {
        throw new Error(
          `${this.name}の引数${p.name}で、/entityまたは/entity/generated、/param以外のオブジェクトは指定できません。`
        );
      }
      return importSentence;
    });
    return paramTypes;
  }

  /**
   * レスポンスタイプを持っているか
   */
  get hasResponseType() {
    let hasResponseType = false;
    if (!this.isRestDecorated) return hasResponseType;

    const returnClass = this.notPromiseReturnType;
    if (!returnClass) return hasResponseType;

    if (returnClass.indexOf('<') > 0) {
      // ジェネリックな戻り値、Response<UserAuth[]>みたいなのを持ってる
      hasResponseType = true;
    }
    return hasResponseType;
  }

  /**
   * Generic型ではない場合にインポート文
   * @param returnClass
   * @returns
   */
  notGenericTypeImportString(returnClass: string) {
    // 戻り値がプリミティブ型ならインポート文不要
    if (Primitive.includes(returnClass)) return '';

    // インポート文
    const importString = `import { ${returnClass} } from '${frameWorkBizDir}${returnClass}';`;
    console.log('not generic ', importString);
    return importString;
  }

  /**
   * メソッドのインポート文を取得
   */
  get importString() {
    if (!this.isRestDecorated) return '';

    const returnClass = this.notPromiseReturnType;

    if (!returnClass) return '';

    // GenericTypeの戻り値ではなかった場合は割とシンプルにインポート文を作る
    if (!isGenericType(returnClass)) {
      return this.notGenericTypeImportString(returnClass);
    }

    // GenericTypeの戻り値だった場合はちょっと面倒
    // 型引数型を取り出す
    let typeArg = getGenericTypeArgType(returnClass);

    // プリミティブ型だったら型インポート文不要
    if (Primitive.includes(typeArg)) return '';

    // 配列の型があれば除外
    typeArg = typeArg.replace('[]', '');
    console.log('typeArg withoute[]', typeArg);

    // entity or entity/genaratedから探す
    const classDefType = findClassDef(typeArg);
    if (classDefType === 'entity') {
      return `import { ${typeArg} } from '${refDistDto}/${typeArg}';`;
    } else if (classDefType === 'dto') {
      return `import { ${typeArg} } from '${refDistDto}/${typeArg}';`;
    } else {
      throw new Error(
        `${this.name}の戻り値型引数${returnClass}で、/entityまたは/entity/generated以外のオブジェクトは指定できません。`
      );
    }
  }
}

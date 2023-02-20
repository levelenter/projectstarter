import { MetaMethod } from './MetaMethod';
import { distinctArray, flatArray } from './common';
import { config }  from "../config/config"

const frameWorkBizDir = "../";

// スキャンしたディレクトリをアウトプットディレクトリから参照するパスを取る
const SERVICE_DIR_FROM_ROUTER = "../." + config.rest_scan_dir;

/**
 * クラスのメタ情報を蓄積する
 */
export class MetaClass {
  public name = '';
  public methods: MetaMethod[] = [];

  /**
   * 出力ファイル名
   */
  public get outFileName() {
    return this.name + '.ts';
  }

  /**
   * @Restメソッドを持っているクラスかどうかを返す
   */
  public get hasRestMetod() {
    return this.methods.some((method) => method.isRestDecorated);
  }

  /**
   * 戻り値型に対応するインポート文を返す
   * @returns
   */
  private getImportResponseClass() {
    // Responseクラスを戻り値に持っているかどうか
    const hasResponseType = this.methods.reduce((a, c: MetaMethod) => a || c.hasResponseType, false);

    // メソッドのインポート文字列を取得
    const result = this.methods.map((m) => m.importString);

    // ベースクラスをインポートする
    result.push(`import { GeneratedBizBase } from '../GeneratedBizBase';`);

    // レスポンスクラスをインポートする
    if (hasResponseType) {
      result.push(`import { Response } from '${frameWorkBizDir}Response';`);
    }
    return distinctArray(result);
  }

  /**
   * クライアントのプロキシのソースコードを返す
   */
  public toClientDefString(): string {
    if (!this.hasRestMetod) return '';

    // 戻り値と引数の型をインポート（重複を削除）
    const impotsAll = distinctArray(this.getImportResponseClass().concat(this.paramDefImportStringArray)).filter((i) => i);
    console.log(impotsAll);

    let str = '';
    str += impotsAll.join('\n\n\n');
    str += `export class ${this.name} extends GeneratedBizBase{\n`;
    str += this.methods.map((m) => m.toClientDefString()).join('');
    str += `}\n`;
    return str;
  }

  /**
   * サーバーサイドRestのソースコードを返す
   */
  public toRestString(): string {
    const str = this.methods
      .map((m) => {
        if (!m) return '';
        return m.toExpressRoutingString(this.name);
      })
      .join('');
    return str ? str : '';
  }

  /**
   * サーバーサイドRESTのbizクラスのインポート文を返す
   */
  public getServiceImportForExpressRouter(): string {
    if (!this.hasRestMetod) return '';
    // return `import { ${this.name} } from '${SERVICE_DIR_FROM_ROUTER}/${this.name}';`;
    return `import { ${this.name} } from '../${this.name}';`;
  }

  /**
   * 各メソッドの引数の型をインポートする文字列配列（サーバーサイドRESTで使用）
   */
  public get paramDefImportStringArrayForExpress() {
    return flatArray<string>(this.methods.map((m) => m.paramDefImportStringArrayForExpress));
  }

  /**
   * 各メソッドの引数の型をインポートする文字列配列（サーバーサイドRESTで使用）
   */
  public get paramDefImportStringArray() {
    return flatArray<string>(this.methods.map((m) => m.paramDefImportStringArray));
  }

  /**
   * 各メソッドの引数部分の型をインポートする1つの文字列（クライアントプロキシクラスで利用）
   */
  public get paramDefimportOneString() {
    return distinctArray(this.paramDefImportStringArray).join('\n');
  }

  /**
   * デコレータの指定ミスをチェック
   */
  public hasErrorInDecorator(): boolean {
    if (!this.hasRestMetod) return false;
    const hasErrors = this.methods
      .map((m) => !m.checkRestDecoretor(this.name))
      .some(() => {
        console.log('');
      });
    return hasErrors;
  }
}

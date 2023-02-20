import { snakeToPascalCase, hasZenkaku } from './common';
import { FieldMeta } from './FieldMeta';

export class EntityMeta {
  public pName = '';
  public lName = '';
  public fields: FieldMeta[] = [];

  get outFileName() {
    return `${this.pClassName}.ts`;
  }
  get outDaoFileName() {
    return `${this.pClassName}DaoGen.ts`;
  }
  get daoClassName() {
    return `${this.pClassName}DaoGen`;
  }

  get pClassName() {
    return snakeToPascalCase(this.pName);
  }

  get hasName() {
    return this.pName || this.lName;
  }
  addField(line: string) {
    const field = new FieldMeta();
    field.parse(line);
    this.fields.push(field);
  }

  public parseLine(line: string) {
    const isPname = line.startsWith('PName');
    if (isPname) this.pName = line.split('=')[1];

    // console.log('this.pName', this.pName);

    const isLname = line.startsWith('LName');
    if (isLname) this.lName = line.split('=')[1];

    if (this.hasName) {
      const isField = line.startsWith('Field=');
      if (isField) this.addField(line);
    }
  }

  /**
   * 主キーデータの取得コード
   * @returns 文字列
   */
  getPrimaryKeysDefString() {
    const keyProperties = this.fields.filter((f) => f.isKey);

    const keysObj = keyProperties.map((f) => {
      return `    "${f.pName}" : this.${f.pName} \n`;
    });
    const keysDef = keyProperties.map((f) => {
      return `"${f.pName}": ${f.type} | undefined`;
    });

    let str = '';
    str += `  getPrimaryKeys(): { ${keysDef.join(',')} } {\n`;
    str += `    const entity = {\n`;
    str += keysObj.join(',\n');
    str += `    }\n`;
    str += `    return entity;\n`;
    str += `  }\n`;

    return str;
  }

  getEntityFromDBRecordString() {
    const properties = this.fields.map((f) => {
      return `    entity.${f.pName} = record['${f.pName}'];\n`;
    });

    let str = '';
    str += `  static fromDB(record: { [column: string]: any; [column: number]: any }): ${this.pClassName} {\n`;
    str += `    const entity = new ${this.pClassName}();\n`;
    str += properties.join('');
    str += `    return entity;\n`;
    str += `  }\n`;

    return str;
  }

  /**
   * エンティティのプロパティに限定したデータを取得する
   * @returns
   */
  getTypeFitEntityFromAny() {
    const properties = this.fields.map((f) => {
      return `    entity.${f.pName} = value.${f.pName};\n`;
    });

    let str = '';
    str += `  static getTypeFitEntity(value: any): ${this.pClassName} {\n`;
    str += `    const entity = new ${this.pClassName}();\n`;
    str += properties.join('');
    str += `    return entity;\n`;
    str += `  }\n`;

    return str;
  }

  /**
   * エンティティのコード文字列を取得
   * @returns
   */
  public toEntityDefString(): string {
    // スネークケースのフィールドを出す
    const filedString = this.fields
      .map((f: FieldMeta) => {
        let str = `  // ${f.lName} DB型(${f.dbType})\n`;

        // 全角文字があったらコメントアウト
        if (hasZenkaku(f.pName)) {
          str += `//`;
        }
        str += `  public ${f.pName}?: ${f.type};`;
        return str;
      })
      .join('\n');

    let entityString = ''; //`/* eslint-disable @typescript-eslint/camelcase */\n`;
    entityString += `// ${this.lName}のエンティティ\n`;
    entityString += `export class ${this.pClassName} {\n`;
    entityString += filedString + `\n`;
    entityString += this.getEntityFromDBRecordString();
    entityString += this.getPrimaryKeysDefString();
    entityString += this.getTypeFitEntityFromAny();
    entityString += `}\n`;

    return entityString;
  }

  toDaoString(): string {
    const selectWhere = this.fields
      .filter((f) => f.isKey)
      .map((f) => ` ${f.pName} = ? `)
      .join(' AND ');
    const selectArgs = this.fields
      .filter((f) => f.isKey)
      .map((f: FieldMeta) => `${f.pName}: ${f.type}`)
      .join(', ');
    const selectParams = this.fields
      .filter((f) => f.isKey)
      .map((f: FieldMeta) => `${f.pName}`)
      .join(', ');
    const keyVoString = this.fields
      .filter((f) => f.isKey)
      .map((f: FieldMeta) => `${f.pName}: value.${f.pName}`)
      .join(', ');

    let entityString = ''; //`/* eslint-disable @typescript-eslint/camelcase */\n`;
    entityString += `// ${this.lName}のDAO\n`;
    entityString += `import { BaseDao } from "./BaseDao";\n`;
    entityString += `import { ResultSetHeader } from 'mysql2';\n`;
    entityString += `import { ${this.pClassName} } from '../dto/${this.pClassName}';\n`;

    entityString += `export class ${this.daoClassName} extends BaseDao {\n`;
    entityString += `  public readonly TABLE_NAME = "${this.pName}";\n\n`;
    entityString += `  // ${this.pClassName}を全件取得\n`;
    entityString += `  async selectAll(): Promise<${this.pClassName}[]> {\n`;
    entityString += `    const sql = 'SELECT * FROM ${this.pName} ';\n`;
    entityString += `    return await this.db.query<${this.pClassName}>(sql);\n`;
    entityString += `  }\n`;

    entityString += `  // ${this.pClassName}を主キーで取得\n`;
    entityString += `  async selectById(${selectArgs}): Promise<${this.pClassName}> {\n`;
    entityString += `    const sql = 'SELECT * FROM ${this.pName} WHERE ${selectWhere} ';\n`;
    entityString += `    const params = [${selectParams}];\n`;
    entityString += `    const results = await this.db.query<${this.pClassName}>(sql, params);\n`;
    entityString += `    return results[0];\n`;
    entityString += `  }\n`;

    entityString += `  // ${this.pClassName}を主キーで削除\n`;
    entityString += `  async deleteById(${selectArgs}): Promise<ResultSetHeader> {\n`;
    entityString += `    const sql = 'DELETE FROM ${this.pName} WHERE ${selectWhere} ';\n`;
    entityString += `    const params = [${selectParams}];\n`;
    entityString += `    return await this.db.execute(sql, params);\n`;
    entityString += `  }\n`;

    entityString += `  // ${this.pClassName}を挿入\n`;
    entityString += `  async insert(value: ${this.pClassName}): Promise<ResultSetHeader> {\n`;
    entityString += `    const sql = this.makeInsertSQL('${this.pName}', value);\n`;
    entityString += `    const params = this.buildParams(value);\n`;
    entityString += `    return await this.db.execute(sql, params);\n`;
    entityString += `  }\n`;

    entityString += `  // ${this.pClassName}を主キーで更新\n`;
    entityString += `  async update(value: ${this.pClassName}): Promise<ResultSetHeader> {\n`;
    entityString += `    const keyVo = { ${keyVoString} };\n`;
    entityString += `    const sql = this.makeUpdateSQL('${this.pName}', keyVo, value);\n`;
    entityString += `    const params = this.buildParams(value);\n`;
    entityString += `    return await this.db.execute(sql, params);\n`;
    entityString += `  }\n`;

    entityString += `  // ${this.pClassName}を主キーで検索し、なければ挿入、あれば更新\n`;
    entityString += `  async insertOrUpdate(entity: ${this.pClassName}): Promise<ResultSetHeader> {\n`;
    entityString += `    return this.insertOrUpdateByObject(this.TABLE_NAME, entity.getPrimaryKeys(), entity);\n`;
    entityString += `  }\n`;

    entityString += `}\n`;

    return entityString;
  }
}

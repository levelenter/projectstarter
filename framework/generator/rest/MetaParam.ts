/**
 * 引数のメタ情報を蓄積する
 */
export class MetaParam {
  public name = '';
  public type = '';

  print() {
    console.log(`param:${this.name}:${this.type}`);
  }

  public get typeWithoutArray() {
    return this.type.replace('[]', '');
  }

  toClientDefString() {
    return `${this.name}: ${this.type}`;
  }

  toParamNamesArrayString() {
    return `"${this.name}"`;
  }

  toRestString(paramObject: string, index: number) {
    // 引数が数値型だったらparse
    if (this.type === 'number') {
      return `parseFloat(${paramObject}[${index}] as string) as ${this.type}`;
    } else {
      return `${paramObject}[${index}] as ${this.type}`;
    }
  }
}

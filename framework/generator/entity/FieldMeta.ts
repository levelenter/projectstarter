import { snakeToCamelCase, trimQuate } from "./common";

export class FieldMeta {
  public pName: string = "";
  public lName: string= "";
  public dbType: string= "";
  public nn: boolean= false;
  public default: string= "";
  public isKey: boolean= false;

  public get pNameCamel() {
    return snakeToCamelCase(this.pName);
  }

  public get type() {
    // console.log('type', this.dbType);
    if (!this.dbType) {
      return "any";
    }
    const dbTypeLow = this.dbType.toLowerCase();
    if (
      dbTypeLow.includes("int") ||
      dbTypeLow.includes("autokey") ||
      dbTypeLow.includes("autokeyFk")
    ) {
      return "number";
    }
    if (
      dbTypeLow.includes("var") ||
      dbTypeLow.includes("char") ||
      dbTypeLow.includes("text") ||
      dbTypeLow.includes("id") ||
      dbTypeLow.includes("fk")
    ) {
      return "string";
    }
    if (dbTypeLow.includes("flg")) {
      return "boolean";
    }
    if (
      dbTypeLow.startsWith("timestamp") ||
      dbTypeLow.startsWith("date") ||
      dbTypeLow.startsWith("@datetime")
    ) {
      return "Date";
    }
    return "any";
  }

  parse(line: string) {
    const fieldCsv = line.split("=")[1];
    const values = fieldCsv.split(",").map((item) => trimQuate(item, `"`));

    this.lName = values[0];
    this.pName = values[1];
    this.dbType = values[2];
    this.nn = values[3] == "NOT NULL";
    this.default = values[5];
    this.isKey = values[4] != "" ? true : false;
    // console.log('iskey', values, this.isKey, values[4]);
  }
}

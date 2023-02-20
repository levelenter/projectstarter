import * as fs from 'fs';

const insertString = `SET SQL_MODE = '';

SET CHARACTER_SET_CLIENT = utf8;

SET CHARACTER_SET_CONNECTION = utf8;

\r\n`;

export function insertCharsetStatement(fileFullPath: string) {
  const data = fs.readFileSync(fileFullPath);
  const dataString = data.toLocaleString();
  const hasStatement = dataString.startsWith(insertString);
  console.log('has Statement ', hasStatement);
  if (!hasStatement) {
    const newData = insertString + dataString;
    fs.writeFileSync(fileFullPath, newData, { encoding: 'utf-8' });
  }
}

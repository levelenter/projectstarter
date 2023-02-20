/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('config');
import { exec } from 'child_process';
const port = config.get('server_port');

console.log(`port:${port} のプロセスを強制終了します`);
exec(`lsof -ti:${port}`, (err: any, stdout: any) => {
  if (err) {
    console.log(`port:${port}でプロセスは起動していません`);
    return;
  }
  const pidTrim = new String(stdout).trim();
  const pids = pidTrim.split('\n');
  pids.forEach((pid: string) => {
    console.log(`プロセスID ${pid}を強制終了します`);
    exec(` kill ${pid}`, (err: any, stdout: any, stderr: any) => {
      if (err) console.log(err);
      console.log(stdout);
      console.log('強制終了完了しました。');
    });
  });
});

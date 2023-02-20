import * as log4js from 'log4js';
import config from 'config';

// 設定ファイル（log-config.json）の読み込み
// log4javascript.configure('../config/logger_config.json', { reloadSecs: 60 });

// ログ出力

class Logger {
  private _logger: log4js.Logger;
  constructor() {
    log4js.configure({
      appenders: {
        filelog: {
          type: 'file',
          filename: config.get<string>('log.path'),
        },
      },
      categories: {
        default: {
          appenders: ['filelog'],
          level: config.get<string>('log.level'),
        },
      },
    });
    this._logger = log4js.getLogger();
    this._logger.level = 'debug';
  }

  public get logger() {
    return this._logger;
  }

  public info(message: any, ...args: any[]): void {
    this.logger.info(message, args);
  }

  public trace(message: any, ...args: any[]): void {
    this.logger.trace(message, args);
  }

  public mark(message: any, ...args: any[]): void {
    this.logger.mark(message, args);
  }

  public debug(message: any, ...args: any[]): void {
    this.logger.debug(message, args);
  }

  public warn(message: any, ...args: any[]): void {
    this.logger.warn(message, args);
  }

  public error(message: any, ...args: any[]): void {
    this.logger.error(message, args);
  }

  public fatal(message: any, ...args: any[]): void {
    this.logger.fatal(message, args);
  }

  public log(message: any, ...args: any[]): void {
    this.logger.debug(message, args);
  }
}
export const logger = new Logger();

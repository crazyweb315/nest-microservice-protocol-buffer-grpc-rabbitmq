import { Injectable, Scope, LoggerService as LoggerBase } from '@nestjs/common';
import pino from 'pino';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements LoggerBase {
  private logger: pino.Logger;

  constructor() {
    this.configureLogger();
  }

  private configureLogger() {
    this.logger = pino({
      level: process.env.NODE_ENV === 'prod' ? 'info' : 'debug',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:dd/mm/yyyy HH:MM:ss',
          ignore: 'pid,hostname',
        },
      },
    });
  }

  private formatMessage(message: any, context: string = ''): string {
    const formattedMessage =
      typeof message === 'object' ? JSON.stringify(message) : message;
    return context ? `[${context}] ${formattedMessage}` : formattedMessage;
  }

  public log(context: string = '', message: any) {
    this.logger.info(this.formatMessage(message, context));
  }

  public error(context: string = '', message: any, info: any = '') {
    this.logger.error(
      { trace: `${this.formatMessage(info, context)}` },
      this.formatMessage(message, context),
    );
  }

  public warn(context: string = '', message: string) {
    this.logger.warn(this.formatMessage(message, context));
  }

  public debug(context: string = '', message: string) {
    this.logger.debug(this.formatMessage(message, context));
  }

  public verbose(context: string = '', message: string) {
    this.logger.trace(this.formatMessage(message, context));
  }
}

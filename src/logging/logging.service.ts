import { Injectable, LogLevel } from '@nestjs/common';
import { writeFile, mkdir, stat, rename } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class LoggingService {
  private readonly logLevels: LogLevel[] = [
    'error',
    'warn',
    'log',
    'debug',
    'verbose',
  ];
  private readonly logLevel: number;
  private readonly maxFileSize: number;
  private readonly errorLogFile: string;
  private readonly appLogFile: string;

  constructor() {
    this.logLevel = parseInt(process.env.LOG_LEVEL || '2');
    this.maxFileSize = parseInt(process.env.MAX_LOG_FILE_SIZE || '1024') * 1024;
    this.errorLogFile = process.env.ERROR_LOG_FILE || 'logs/error.log';
    this.appLogFile = process.env.APP_LOG_FILE || 'logs/app.log';
    this.ensureLogDirectoryExists();
  }

  private async ensureLogDirectoryExists(): Promise<void> {
    try {
      const logDir = 'logs';
      await mkdir(logDir, { recursive: true });
    } catch (error) {
      // Directory already exists or cannot be created
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levelIndex = this.logLevels.indexOf(level);

    return levelIndex >= 0 && levelIndex <= this.logLevel;
  }

  private async rotateLogFile(filePath: string): Promise<void> {
    try {
      const stats = await stat(filePath);

      if (stats.size >= this.maxFileSize) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const rotatedFilePath = filePath.replace('.log', `-${timestamp}.log`);
        await rename(filePath, rotatedFilePath);
      }
    } catch (error) {
      // File doesn't exist or cannot be rotated
    }
  }

  private async writeToFile(filePath: string, message: string): Promise<void> {
    try {
      await this.rotateLogFile(filePath);
      await writeFile(filePath, message + '\n', { flag: 'a' });
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: string,
  ): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}] ` : '';

    return `${timestamp} [${level.toUpperCase()}] ${contextStr}${message}`;
  }

  async log(message: string, context?: string): Promise<void> {
    if (this.shouldLog('log')) {
      const formattedMessage = this.formatMessage('log', message, context);
      console.log(formattedMessage);
      await this.writeToFile(this.appLogFile, formattedMessage);
    }
  }

  async error(
    message: string,
    trace?: string,
    context?: string,
  ): Promise<void> {
    if (this.shouldLog('error')) {
      const errorMessage = trace ? `${message}\n${trace}` : message;
      const formattedMessage = this.formatMessage(
        'error',
        errorMessage,
        context,
      );
      console.error(formattedMessage);
      await this.writeToFile(this.errorLogFile, formattedMessage);
      await this.writeToFile(this.appLogFile, formattedMessage);
    }
  }

  async warn(message: string, context?: string): Promise<void> {
    if (this.shouldLog('warn')) {
      const formattedMessage = this.formatMessage('warn', message, context);
      console.warn(formattedMessage);
      await this.writeToFile(this.appLogFile, formattedMessage);
    }
  }

  async debug(message: string, context?: string): Promise<void> {
    if (this.shouldLog('debug')) {
      const formattedMessage = this.formatMessage('debug', message, context);
      console.debug(formattedMessage);
      await this.writeToFile(this.appLogFile, formattedMessage);
    }
  }

  async verbose(message: string, context?: string): Promise<void> {
    if (this.shouldLog('verbose')) {
      const formattedMessage = this.formatMessage('verbose', message, context);
      console.log(formattedMessage);
      await this.writeToFile(this.appLogFile, formattedMessage);
    }
  }

  private sanitizeData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sensitiveFields = [
      'password',
      'oldPassword',
      'newPassword',
      'refreshToken',
      'accessToken',
      'token',
      'authorization',
      'secret',
      'key',
    ];

    const sanitized = { ...data };

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }

    for (const key in sanitized) {
      if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        sanitized[key] = this.sanitizeData(sanitized[key]);
      }
    }

    return sanitized;
  }

  async logRequest(
    url: string,
    method: string,
    query: any,
    body: any,
  ): Promise<void> {
    const requestData = {
      url,
      method,
      query: this.sanitizeData(query),
      body: this.sanitizeData(body),
      timestamp: new Date().toISOString(),
    };
    await this.log(`Request: ${JSON.stringify(requestData)}`, 'HTTP');
  }

  async logResponse(
    url: string,
    method: string,
    statusCode: number,
    responseTime: number,
  ): Promise<void> {
    const responseData = {
      url,
      method,
      statusCode,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    };
    await this.log(`Response: ${JSON.stringify(responseData)}`, 'HTTP');
  }
}

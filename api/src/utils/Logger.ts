import { format } from "date-fns";

export enum LogLevel {
  ERROR = "ERROR",
  WARN = "WARN",
  INFO = "INFO",
  DEBUG = "DEBUG",
}

interface LogLevelsMap {
  [key: string]: number;
}

interface LogEmojisMap {
  [key: string]: string;
}

const LOG_LEVELS: LogLevelsMap = {
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
};

const LOG_EMOJIS: LogEmojisMap = {
  ERROR: "🔴",
  WARN: "🟡",
  INFO: "🔵",
  DEBUG: "🟢",
};

const currentLogLevel = (): number => {
  const level = process.env.LOG_LEVEL?.toUpperCase() as string;
  return LOG_LEVELS[level] || LOG_LEVELS.DEBUG;
};

const shouldLog = (level: LogLevel): boolean => {
  return LOG_LEVELS[level] <= currentLogLevel();
};

const formatMessage = (
  level: LogLevel,
  key: string,
  message: string,
  data?: unknown,
): string => {
  const timestamp = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  const emoji = LOG_EMOJIS[level];
  const dataStr = data ? ` | ${JSON.stringify(data)}` : "";
  return `[${timestamp}] ${emoji} [${key}] ${message} ${dataStr}`;
};

export class Logger {
  static error(key: string, message: string, data?: unknown): void {
    if (shouldLog(LogLevel.ERROR)) {
      console.error(formatMessage(LogLevel.ERROR, key, message, data));
    }
  }

  static warn(key: string, message: string, data?: unknown): void {
    if (shouldLog(LogLevel.WARN)) {
      console.warn(formatMessage(LogLevel.WARN, key, message, data));
    }
  }

  static info(key: string, message: string, data?: unknown): void {
    if (shouldLog(LogLevel.INFO)) {
      console.info(formatMessage(LogLevel.INFO, key, message, data));
    }
  }

  static debug(key: string, message: string, data?: unknown): void {
    if (shouldLog(LogLevel.DEBUG)) {
      console.debug(formatMessage(LogLevel.DEBUG, key, message, data));
    }
  }
}

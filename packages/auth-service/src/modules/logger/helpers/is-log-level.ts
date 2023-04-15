import { LogLevel } from '../models';

export const isLogLevel = (value: unknown): value is LogLevel => {
  const allLogLevels: string[] = [
    LogLevel.Error,
    LogLevel.Warn,
    LogLevel.Info,
    LogLevel.HTTP,
    LogLevel.Verbose,
    LogLevel.Debug,
    LogLevel.Silly,
  ];

  if (typeof value !== 'string') {
    return false;
  }

  return allLogLevels.indexOf(value) !== -1;
};

import moment from 'moment';
import * as winston from 'winston';
import { LogLevel } from '../models';

export const formatter = winston.format((info) => {
  if (info.level === LogLevel.HTTP) {
    return info;
  }

  if (process.env.NODE_ENV !== 'test') {
    info.message = `[${moment().format('ddd MMM DD HH:mm:ss YYYY')}] [${info.level}] ${
      info.message
    }`;
  }

  return info;
});

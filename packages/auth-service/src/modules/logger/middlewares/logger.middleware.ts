import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '../helpers';
import { IRequestLog } from '../interfaces';

@Injectable()
export class LoggerMiddleware implements NestMiddleware<Request, Response> {
  public constructor(private readonly _logger: Logger) {}

  public use = (req: IRequestLog, res: Response, next: () => void) => {
    const before = Date.now();
    const id = req.headers['x-request-id'] ? req.headers['x-request-id'] : uuidv4();

    this._logger.setDefaultMeta(id as string);

    const span = req.headers['x-span'] || '0';

    req.correlationId = id;
    req.parentSpan = span;
    req.span = span;

    next();

    res.on('close', () => {
      this._logger.http(this.generateLogMessage(req, res, Date.now() - before));
    });
  };

  private generateLogMessage = (req: IRequestLog, res: Response, timeTaken: number): string => {
    const size = this.getResponseSize(res);
    const terms: { [key: string]: string } = {
      '%h': req.socket.remoteAddress || '-',
      '%l': '-',
      '%x1': `span=${req.span}`,
      '%x2': `trace=${req.correlationId}`,
      '%x3': 'type=Incoming request',
      '%u': '-',
      '%t': `date=[${moment().format('DD/MMM/YYYY:HH:mm:ss ZZ')}]`,
      '%r': `request=${req.method} ${req.originalUrl} ${req.httpVersion}`,
      '%>s': `status=${res.statusCode}`,
      '%b': size === 0 ? 'size=-' : `size=${size}`,
      '%tt': `duration=${timeTaken}`,
    };

    let str = '%t %x2 %x3 "%r" %x1 %>s %b %tt';

    for (const term in terms) {
      if (term in terms) {
        str = str.replace(term, terms[term]);
      }
    }

    str = str.replace(/%\{([a-zA-Z\-]+)\}i/g, (_, p1) => {
      const header = req.headers[`${p1}`.toLowerCase()];

      if (header == null) {
        return '-';
      }

      if (Array.isArray(header)) {
        return `"${header.join(',')}"`;
      }

      return `"${header}"`;
    });

    return str;
  };

  private getResponseSize = (res: Response): number => {
    const sizeRaw = res.getHeader('Content-Length');

    if (typeof sizeRaw === 'number') {
      return sizeRaw;
    }

    if (typeof sizeRaw === 'string') {
      const parsed = parseInt(sizeRaw, 10);

      if (isNaN(parsed)) {
        return 0;
      }

      return parsed;
    }

    return 0;
  };
}

import { Request } from 'express';

export interface IRequestLog extends Request {
  correlationId?: string | string[];
  parentSpan?: string | string[];
  span?: string | string[];
  origin?: string;
}

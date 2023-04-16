import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

export class AuthMiddleware implements NestMiddleware {
  private proxy = createProxyMiddleware({
    target: 'http://localhost:3000/api/v1/',
    pathRewrite: { '/api/v1/auth-service': '/' },
    secure: false,
    onProxyReq: (proxyReq, req: Request, res: Response) => {
      console.log(proxyReq);
      console.log(res);
      console.log(
        `[NestMiddleware]: Proxying ${req.method} request originally made to '${req.originalUrl}'...`
      );
    },
  });

  public use = (req: Request, res: Response, next: () => void): void => {
    console.log(res);
    this.proxy(req, res, next);
  };
}

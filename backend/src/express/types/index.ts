import * as express from 'express';

declare module 'express' {
  interface Application {
    get(path: string, handler: (req: express.Request, res: express.Response) => any): this;
    post(path: string, handler: (req: express.Request, res: express.Response) => any): this;
    put(path: string, handler: (req: express.Request, res: express.Response) => any): this;
    delete(path: string, handler: (req: express.Request, res: express.Response) => any): this;
  }
}
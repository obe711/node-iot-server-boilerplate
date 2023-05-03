import { convert as openapiToPostmanv2 } from 'openapi-to-postmanv2';
import { Request, Response, NextFunction } from 'express';

const middleware = (openapiData: Record<string, any>) => (req: Request, res: Response, next: NextFunction) => {
  openapiToPostmanv2({ type: 'json', data: openapiData }, {}, (err: Error, conversionResult: Record<string, any>) => {
    if (!conversionResult.result) {
      next(conversionResult.reason);
    } else {
      res.send(conversionResult.output[0].data);
    }
  });
};

export default middleware;


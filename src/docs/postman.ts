import Converter from 'openapi-to-postmanv2';
import { Request, Response, NextFunction } from 'express';

interface OpenApi {
  openapiData: object;
}

export const apiConverter = (openApi: OpenApi) => (req: Request, res: Response, next: NextFunction) => {
  Converter.convert({ type: 'json', data: openApi }, {}, (err, conversionResult) => {
    if (!conversionResult.result) {
      next(conversionResult.reason);
    } else {
      res.send(conversionResult.output[0].data);
    }
  });
};



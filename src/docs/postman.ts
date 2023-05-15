import Converter from 'openapi-to-postmanv2';
import { Request, Response, NextFunction } from 'express';

export default function convertOpenApiToPostman(openapiData: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    Converter.convert({ type: 'json', data: openapiData }, {}, (err, conversionResult) => {
      if (!conversionResult.result) {
        next(conversionResult.reason);
      } else {
        res.send(conversionResult.output[0].data);
      }
    });
  };
}




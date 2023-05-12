import Converter, { ConvertResult } from 'openapi-to-postmanv2';
import { Request, Response, NextFunction } from 'express';

interface OpenApi {
  openapiData: object;
}

const apiConverter = (openApi: OpenApi)  => (req: Request, res: Response, next: NextFunction) => {
  Converter.convert(
    { type: 'string', data: openApi },
    {},
    (_err:Error, conversionResult: ConvertResult) => { 
      if (!conversionResult.result) {
        next(conversionResult.reason);
      } else {
        res.send(conversionResult.output[0].data);
      }
    }
  );
};

export default apiConverter;





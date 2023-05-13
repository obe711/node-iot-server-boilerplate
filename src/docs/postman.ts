import Converter, { ConvertResult } from 'openapi-to-postmanv2';
import { Request, Response, NextFunction } from 'express';

interface OpenApi {
  openapiData: string;
}

interface convertResult {
  result: 'converted' | 'failed';
  //output?: PostmanCollection;
  reason?: string;
  //errors?: ConversionError[];
}

const apiConverter = (openApi: OpenApi)  => (req: Request, res: Response, next: NextFunction) => {
  Converter.convert(
    { type: 'string', data: openApi.openapiData },
    {},
    (err:Error, conversionResult: convertResult) => { 
      if (!conversionResult.result) {
        next(conversionResult.reason);
      } else {
        res.send(conversionResult.output[0].data);
      }
    }
  );
};

export default apiConverter;





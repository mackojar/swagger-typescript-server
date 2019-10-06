import * as swaggerTools from 'swagger-tools';
import * as http from 'http';
import { EchoRequest, EchoResponse } from '../model/models';

interface EchoRequestParameters extends swaggerTools.SwaggerRequestParameters {
  [paramName: string]: swaggerTools.SwaggerRequestParameter<EchoRequest>;
}

export function echo( req: swaggerTools.Swagger20Request<EchoRequestParameters>, res: http.ServerResponse, next: (arg?: any) => void) {
  res.setHeader('Content-Type', 'application/json');
  const body: EchoRequest = req.swagger.params['body'].value;
  console.log('Body: %j', body);
  let response: EchoResponse = {
    msgOut: 'Echo Response: ' + body.msgIn
  }
  res.end(JSON.stringify(response));
};

import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import * as jsyaml from 'js-yaml';
import * as connect from 'connect';
import * as swaggerTools from 'swagger-tools';
import { init as securityInit, basicAuth } from './security';
import { ErrorResponse } from './model/models'

const SERVER_PORT = 8080;

const options: swaggerTools.SwaggerRouter20Options = {
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

let securityOptions: swaggerTools.SwaggerSecurityOptions = {
  'BasicAuth': basicAuth
}

function errorHandler(err: any, req: http.IncomingMessage, res: http.ServerResponse, next: connect.NextFunction) {
  if (res.headersSent) {
    return next(err)
  }
  res.setHeader('Content-Type', 'application/json');
  if( err && err.statusCode) {
    res.statusCode = err.statusCode;
  } else {
    res.statusCode = 500
  }
  let out: ErrorResponse;
  if( err && err.message) {
    out = { error: err.message };
  } else {
    out = { error: '' + err };
  }
  let outStr = JSON.stringify(out);
  console.error( 'ErrorHandler: %s, Stack: %s', outStr, ( err.stack ? err.stack : 'unavailable'));
  res.end(outStr);
}

export async function main() {

  process.on('SIGINT', () => {
    console.error('Received SIGINT.');
    process.exit();
  });
  process.on('SIGTERM', () => {
    console.error('Received SIGTERM.');
    process.exit();
  });
  process.on('uncaughtException', (error) => {
    console.error("CRASHED: " + error.stack);
    process.exit(99);
  });

  const spec: string = fs.readFileSync(path.join(__dirname,'../../swagger/swagger.yaml'), 'utf8');
  const swaggerDoc: any = jsyaml.safeLoad(spec);

  securityInit();

  const app: connect.Server = connect();

  // Initialize the Swagger middleware
  swaggerTools.initializeMiddleware(swaggerDoc, (middleware: swaggerTools.Middleware20) => {
    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(middleware.swaggerMetadata());
    // Enable security
    app.use(middleware.swaggerSecurity( securityOptions));
    // Validate Swagger requests
    app.use(middleware.swaggerValidator());
    // Route validated requests to appropriate controller
    app.use(middleware.swaggerRouter(options));
    // Serve the Swagger documents and Swagger UI
    app.use(middleware.swaggerUi());
    // Common error handler especially to catch security errors (required because of missing res object in swagger-tools security callback)
    app.use(errorHandler);
    // Start the server
    http.createServer(app).listen(SERVER_PORT, function () {
      console.log('Your server is listening on http://localhost:%d', SERVER_PORT);
      console.log('Swagger-ui is available on http://localhost:%d/docs', SERVER_PORT);
    });

  });
}

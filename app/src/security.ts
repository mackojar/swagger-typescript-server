import * as http from 'http';
import * as swaggerTools from 'swagger-tools';
import * as passport from 'passport';
import { BasicStrategy } from 'passport-http';

interface Users {
  [path: string]: UserData;
}

interface UserData {
  pass: string
}

const USERS: Users = {
  user1: { pass: 'passw0rd' }
}

const ERR_401 = {
  statusCode: 401,
  message: 'Incorrect credentials'
}

export function init() {
  passport.use( 'basic',
    new BasicStrategy( (username: string, password: string, done: (error: any, user?: any) => void) => {
      if( USERS[username] && USERS[username].pass == password) {
        console.log('User Auth OK: %s', username);
        done( null, { user: username });
      } else {
        console.log('User Auth Failed: %s', username);
        done( ERR_401);
      }
    })
  );
}

export function basicAuth(request: http.IncomingMessage, 
    securityDefinition: any, scopes: string | string[], 
    callback: swaggerTools.SwaggerSecurityCallback) {
  let authFun = passport.authenticate( 'basic', { session: false }, (err: any, user: string, info: any, status: any) => {
    // this callback is required only if any additional checks is required (for example RBAC)
    if( user) {
      console.log('User OK');
      // any additional checks if required
      return callback();
    } else {
      return callback(ERR_401);
    }
  });
  authFun( request, null, callback); // no res available: https://github.com/apigee-127/swagger-tools/issues/203
};

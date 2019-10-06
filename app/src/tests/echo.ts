import * as supertest from 'supertest';
import {EchoRequest,EchoResponse,ErrorResponse} from '../model/models';
import { expect } from 'chai';

const AUTH = {
  user: 'user1',
  pass: 'passw0rd'
}

describe('Echo', () => {

  let agent = supertest.agent( 'localhost:8080');

  it('invokes GET /echo', done => {
    const request: EchoRequest = {
      msgIn: 'msg1'
    }
    const response: EchoResponse = {
      msgOut: 'Echo Response: msg1'
    }
    agent.post('/api/v1/echo')
      .set('Accept', 'application/json')
      .auth(AUTH.user, AUTH.pass)
      .send( request)
      .expect(200)
      .end( (err: any, res: supertest.Response) => {
        expect( err).to.not.exist;
        expect( res.body).to.deep.eq( response);
        done();
      });
  });

  it('invokes GET /echo - wrong format', done => {
    agent.post('/api/v1/echo')
      .set('Accept', 'application/json')
      .auth(AUTH.user, AUTH.pass)
      .send({})
      .expect(500, done);
  });

  it('invokes GET /echo - authentication failure', done => {
    const request: EchoRequest = {
      msgIn: 'msg1'
    }
    const response: EchoResponse = {
      msgOut: 'Echo Response: msg1'
    }
    agent.post('/api/v1/echo')
      .set('Accept', 'application/json')
      .auth(AUTH.user, AUTH.pass+'x')
      .send( request)
      .expect(401, done);
  });

  it('invokes GET /echo - no authentication info', done => {
    const request: EchoRequest = {
      msgIn: 'msg1'
    }
    const response: ErrorResponse = {
      error: 'Echo Response: msg1'
    }
    agent.post('/api/v1/echo')
      .set('Accept', 'application/json')
      .send( request)
      .expect(401, done);
  });

});

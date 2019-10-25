# Swagger TypeScript generated REST API server

## Overview
This project leverages [swagger-tools](https://github.com/apigee-127/swagger-tools) middleware and [swagger-codegen](https://github.com/swagger-api/swagger-codegen/tree/v2.4.9) - great tool to generate client/server source code based on Swagger API definition. However, [swagger-codegen](https://github.com/swagger-api/swagger-codegen/tree/v2.4.8) does not generate TypeScript REST API server. 

Thus, here comes this project. It acts as a helper and template for generating TypeScript REST API server based on Swagger definition.
It also leverages [passport](https://www.npmjs.com/package/passport) to enforce security defined in Swagger file. It is called from [swagger-tools](https://github.com/apigee-127/swagger-tools) - so we can make any per-API specific security checks based on the Swagger API definition (see `app/src/security.ts`, function `basicAuth` and its `securityDefinition` argument)

## Running the sample server
To run the server, run:

```
cd app
npm install
npm start
```

To run automatic tests, run from other terminal:
```
cd app
npm test
```

## Adapting the server
To adapt the server to your project do the following:
- fork and clone this project
- download current `swagger-codegen-cli` v 2 and 3: `./downloadSwagger.sh`
- use `./generateSwagger.sh <your swagger file> <optional swagger version:2/3>` to generate your TypeScript model definitions.
It generates Angular Typescript model (in temporary `tsang` folder), but takes only the model from there - copies it to `./app/src/model` (note, it overrides the old model).
Controllers (API handlers) have to be created by you.
- go to `app/src/controllers`, take Test.ts as your controller template.

### How to prepare your controller
- For each API in Swagger file take `x-swagger-router-controller`: it will name your target controller file name. Copy sample `Test.ts` to this file name.
- Then for each API take `operationId` value: this will name your controller function. Copy sample `echo` function from sample `Test.ts` and create your API controller function. You are almost there!
- Based on `EchoRequestParameters` create your own request parameters object: change its name and change `<EchoRequest>` generic parameter to your type (obviously you have to import it first)
- Use your new request parameters object as generic parameter of `req` type definition for your API handler.
- Update your API handler to meet your needs.

And that's it! Enjoy!

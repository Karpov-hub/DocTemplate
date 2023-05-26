const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });
const outputFile = "./swagger/swagger-output.json";
const endpointsFiles = ["./src/index.js"];
const config = require("@app/config");

const doc = {
  info: {
    version: "0.0.1", // by default: '1.0.0'
    title: "DocTemplate", // by default: 'REST API'
    description: "REST service API documentation" // by default: ''
  },
  host: `${config.baseApiUrl}:${config.baseApiPort}`, // by default: 'localhost:3000'
  basePath: "", // by default: '/'
  schemes: [], // by default: ['http']
  consumes: [], // by default: ['application/json']
  produces: [], // by default: ['application/json']
  securityDefinitions: {}, // by default: empty object
  definitions: {}, // by default: empty object (Swagger 2.0)
  components: {} // by default: empty object (OpenAPI 3.x)
};

swaggerAutogen(outputFile, endpointsFiles, doc);

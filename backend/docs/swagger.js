const path = require("path");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Take‑Home Assessment",
      version: "1.0.0",
      description: "API documentation for Items service",
    },
  },
  apis: [path.resolve(__dirname, "../src/routes/*.js")],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

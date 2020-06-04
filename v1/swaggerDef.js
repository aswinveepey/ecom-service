// swagger definition
const swaggerDefinition = {
  info: {
    title: "HYSS Inframart REST API",
    version: "1.0.0",
    description:
      "LIT Tracks API documentation. Each user is identified by a numeric ID",
    contact: {
      name: "tech@lit",
      email: "contact@littech.in"
    }
  },
  produces: ["application/json"],
  consumes: ["application/json"],
  basePath: "/api/v1/{userid}",
  definitions: {},
  parameters: {
    CommonPathParameterHeader: {
      name: 'userid',
      type: 'string',
      in: 'path',
      required: true,
      description: 'The requester id'
    }
  }
};

var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./v1/routes/*'],// pass all in array 
  };

module.exports = options;
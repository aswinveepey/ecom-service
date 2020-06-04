var express = require('express');
var logger = require('morgan');
const bodyParser = require("body-parser");
var app = express();

//get versioned routes
const routerV1 = require('./v1/routes/index');

//import auth middleware
// const {auth} = require("./v1/middlewares/authMiddleware");

//logger set up
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Swagger related setup
 */
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const options = require("./v1/swaggerDef");
const swaggerSpec = swaggerJSDoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, false, { docExpansion: "none" })
);

// parse application/json
app.use(bodyParser.json())
/**
 * Add prefix version to the route
 */
app.use("/api/v1", routerV1);

app.listen(3002, () =>
  console.log(
    `Service ready & listening at port: 3002`
  )
);

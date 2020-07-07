var express = require("express");
const Sentry = require("@sentry/node");
var logger = require("morgan");
const bodyParser = require("body-parser");
var cors = require("cors");

//env config
require("dotenv").config();

//db config
require("./v1/db/db");

//Sentry init
Sentry.init({
  dsn:
    process.env.SENTRY_DSN,
});

/**
 * Swagger related setup
 */
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const options = require("./v1/swaggerDef");
const swaggerSpec = swaggerJSDoc(options);

//get versioned routes
const routerV1 = require("./v1/routes/index");

// create Express APP
var app = express();

//logger set up
// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());
//cors
app.use(cors());
//logger middleware and config
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//swagger middleware
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, false, { docExpansion: "none" })
);
// parse application/json
app.use(bodyParser.json());
/**
 * Add prefix version to the route
 */
app.use("/api/v1/:tenantId", routerV1);

app.listen(process.env.SERVICE_PORT || 3002, () =>
  console.log(`Service ready & listening at port: ` + process.env.SERVICE_PORT)
);

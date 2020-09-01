var express = require("express");
var Sentry = require("@sentry/node");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");
var compression = require("compression");
var winston = require("./logger/winston");
const { initClientDbConnection } = require("./v1/db/dbutil");
const {processTenantDb} = require('./v1/middlewares/tenant')

//env config
require("dotenv").config();

//db config
// require("./v1/db/db");

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
app.use(morgan("combined"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// compress all responses
app.use(compression())
//swagger middleware
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, false, { docExpansion: "none" })
);
// parse application/json
app.use(bodyParser.json());

global.clientConnection = initClientDbConnection();
/**
 * Add prefix version to the route
 */
app.get("/health",(req,res)=>{
  return res.status(200).json("Healthy");
})

/**
 * Add prefix version to the route
 */
app.use("/api/v1", processTenantDb, routerV1);

app.listen(process.env.SERVICE_PORT || 3002, () =>
  console.log(`Service ready & listening at port: ` + process.env.SERVICE_PORT)
);

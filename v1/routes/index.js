var express = require("express");
const routes = express.Router();
const { authRouter } = require("./authRoutes");
const { dashRouter } = require("./dashRoutes");
const {auth} = require('../middlewares/auth')

routes.use("/auth", authRouter);
routes.use("/dash",auth, dashRouter);
//Swagger
/**
 * @swagger
 * /health:
 *    get:
 *      summary: Check if endpoint working
 *      parameters:
 *        - $ref: '#/parameters/CommonPathParameterHeader'
 *      tags:
 *        - apihealth
 *      responses:
 *          200:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 */

routes.get("/health", function (req, res) {
  return res.status(200).json("Healthy");
});

/**
 * Module returns
 */
module.exports = routes;
var express = require("express");
const routes = express.Router();
const { authRouter } = require("./authRoutes");
// const { dashRouter } = require("./dashRoutes");
const { permissionRouter } = require("./permissionRoutes");
const { roleRouter } = require("./roleRoutes");
const { userRouter } = require("./userRoutes");
const { territoryRouter } = require("./territoryRoutes");
const { divisionRouter } = require("./divisionRoutes");
const { searchRouter } = require("./searchRoutes");
const { accountRouter } = require("./accountRoutes");
const { customerRouter } = require("./customerRoutes");
const {auth} = require('../middlewares/auth')

routes.use("/auth", authRouter);
// routes.use("/dash",auth, dashRouter);
routes.use("/permission",auth, permissionRouter);
routes.use("/role",auth, roleRouter);
routes.use("/user",auth, userRouter);
routes.use("/territory", auth, territoryRouter);
routes.use("/division", auth, divisionRouter);
routes.use("/search", auth, searchRouter);
routes.use("/account", auth, accountRouter);
routes.use("/customer", customerRouter);
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
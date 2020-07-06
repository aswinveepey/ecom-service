const express = require("express");
const dashRouter = express.Router();
const dashController = require("../controllers/dashController");
const { user } = require("../middlewares/user");

/**
 * Get Dashboard entries
 */
/**
 * @swagger
 * /:
 *    get:
 *      summary: Get Dashboard Data
 *      parameters:
 *        - $ref: '#/parameters/CommonPathParameterHeader'
 *        - in: header
 *          name: token
 *      tags:
 *        - auth
 *      responses:
 *         201:
 *          examples:
 *           application/json: {
 *             "message":"some response"
 *           }
 */

dashRouter.get("/", user, dashController.getData);

// export module
module.exports = { dashRouter };
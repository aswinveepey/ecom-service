const express = require("express");
const dashRouter = express.Router();
const dashController = require("../controllers/dashController");

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

dashRouter.get("/", dashController.getData);

// export module
module.exports = { dashRouter };
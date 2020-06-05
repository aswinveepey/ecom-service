const express = require('express')
const authRouter = express.Router();
const authController= require("../controllers/authController");

/**
 * Create new Authentication
 */

/**
 * Create a user
 */
/**
 * @swagger
 * /authenticate:
 *    post:
 *      summary: Authenticate a user
 *      parameters:
 *        - $ref: '#/parameters/CommonPathParameterHeader'
 *        - in: body
 *          name: body
 *          description: enter user details
 *          schema:
 *          type: object
 *          required:
 *            - username/email
 *            - password
 *          properties:
 *            username:
 *              type: string
 *            password:
 *              type: string
 *      tags:
 *        - auth
 *      requestBody:
 *        description: Enter user details
 *        required: true
 *        content:
 *          application/json:
 *      responses:
 *         201:
 *          examples:
 *           application/json: {
 *             "message":"some response"
 *           }
 */
authRouter.post("/", authController.createAuth);

// export module
module.exports = { authRouter };
const express = require('express')
const authRouter = express.Router();
const authController= require("../controllers/authController");
/**
 * Authenticate an entity
 */
/**
 * @swagger
 * /authenticate:
 *    post:
 *      summary: Authenticate an entity
 *      parameters:
 *        - $ref: '#/parameters/CommonPathParameterHeader'
 *        - in: body
 *          name: body
 *          description: enter authentication details
 *          schema:
 *          type: object
 *          required:
 *            - username
 *            - password
 *          properties:
 *            username:
 *              type: string
 *            password:
 *              type: string
 *      tags:
 *        - auth
 *      requestBody:
 *        description: Enter auth details
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
authRouter.post("/authenticate", authController.verifyAuth);

/**
 * Create new Authentication
 */
/**
 * @swagger
 * /create:
 *    post:
 *      summary: Create a new Auth
 *      parameters:
 *        - $ref: '#/parameters/CommonPathParameterHeader'
 *        - in: body
 *          name: body
 *          description: enter authentication details
 *          schema:
 *          type: object
 *          required:
 *            - username
 *            - password
 *            - mobilenumber
 *            - email
 *          properties:
 *            username:
 *              type: string
 *            password:
 *              type: string
 *            mobilenumber:
 *              type: string
 *            email:
 *              type: email
 *      tags:
 *        - auth
 *      requestBody:
 *        description: Enter auth details
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
authRouter.post("/create", authController.createAuth);

// export module
module.exports = { authRouter };
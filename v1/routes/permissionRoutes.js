const express = require('express')
const permissionRouter = express.Router();
const permissionController = require('../controllers/permissionController')
const { user } = require("../middlewares/user");

permissionRouter.get('/', user, permissionController.getPermissions );
permissionRouter.post('/', user, permissionController.createPermission );

module.exports = { permissionRouter };
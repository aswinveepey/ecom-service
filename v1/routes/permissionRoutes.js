const express = require('express')
const permissionRouter = express.Router();
const permissionController = require('../controllers/permissionController')

permissionRouter.get('/', permissionController.getPermissions );
permissionRouter.post('/', permissionController.createPermission );

module.exports = { permissionRouter };
const express = require('express')
const roleRouter = express.Router()
const roleController = require('../controllers/roleController')
const { user } = require("../middlewares/user");
const { admin } = require("../middlewares/role");

roleRouter.get('/', user, admin, roleController.getRoles)
roleRouter.post('/', user, admin , roleController.createRoles)

module.exports = { roleRouter };
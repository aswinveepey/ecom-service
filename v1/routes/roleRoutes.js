const express = require('express')
const roleRouter = express.Router()
const roleController = require('../controllers/roleController')
const { user } = require("../middlewares/user");

roleRouter.get('/', user, roleController.getRoles)
roleRouter.post('/', user, roleController.createRoles)

module.exports = { roleRouter };
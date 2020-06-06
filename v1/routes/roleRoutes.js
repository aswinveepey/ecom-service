const express = require('express')
const roleRouter = express.Router()
const roleController = require('../controllers/roleController')

roleRouter.get('/', roleController.getRoles)
roleRouter.post('/', roleController.createRoles)

module.exports = { roleRouter };
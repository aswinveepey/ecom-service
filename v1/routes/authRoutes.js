const express = require('express')
const authRouter = express.Router();
const authController= require("../controllers/authController");
authRouter.post("/authenticate", authController.usernameAuth);
authRouter.post("/create", authController.createAuth);
authRouter.post("/generateOtp", authController.generateOtp);
authRouter.post("/verifyOtp", authController.otpAuth);

// export module
module.exports = { authRouter };
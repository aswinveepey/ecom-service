const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");

userRouter.get("/", userController.getAllUsers);
userRouter.get("/:userId", userController.getOneUser);
userRouter.post("/", userController.createUser);

module.exports = { userRouter };

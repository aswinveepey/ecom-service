const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");

userRouter.get("/", userController.getAllUsers);
userRouter.get("/dash", userController.getUserDash);
userRouter.get("/nav", userController.getUserNav);
userRouter.get("/id/:userId", userController.getOneUser);
userRouter.post("/", userController.createUser);
userRouter.post("/id/:userId", userController.updateUser);
userRouter.post("/search", userController.searchUser);
// userRouter.get("/search", userController.searchUser);

module.exports = { userRouter };

const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");
const { user } = require("../middlewares/user");

userRouter.get("/", user, userController.getAllUsers);
userRouter.get("/dash", user, userController.getUserDash);
userRouter.get("/nav", user, userController.getUserNav);
userRouter.get("/id/:userId", user, userController.getOneUser);
userRouter.post("/", user, userController.createUser);
userRouter.post("/id/:userId", user, userController.updateUser);
userRouter.post("/search", user, userController.searchUser);
// userRouter.get("/search", userController.searchUser);

module.exports = { userRouter };

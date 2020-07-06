const express = require("express");
const categoryRouter = express.Router();
const categoryController = require("../controllers/categoryController");
const { user } = require("../middlewares/user");

categoryRouter.get("/", categoryController.getAllCategories);
categoryRouter.get("/id/:userId", categoryController.getOneCategory);
categoryRouter.post("/", user, categoryController.createCategory);
categoryRouter.post("/id/:userId", user, categoryController.updateCategory);
categoryRouter.post("/search", categoryController.searchCategory);

module.exports = { categoryRouter };

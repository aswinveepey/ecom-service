const express = require("express");
const categoryRouter = express.Router();
const categoryController = require("../controllers/categoryController");
const { user } = require("../middlewares/user");

categoryRouter.get("/", categoryController.getAllCategories);
categoryRouter.get("/id/:categoryId", categoryController.getOneCategory);
categoryRouter.post("/", user, categoryController.createCategory);
categoryRouter.post("/id/:categoryId", user, categoryController.updateCategory);
categoryRouter.post("/search", categoryController.searchCategory);

module.exports = { categoryRouter };

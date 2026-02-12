const express = require("express");
const mainCategoryController = require("../controllers/mainCategoryController"); // CJS

const router = express.Router();

// Create a new main category
router.post("/", mainCategoryController.createCategory);

// Get all categories
router.get("/", mainCategoryController.getAllCategories);

// Get category by ID
router.get("/:categoryId", mainCategoryController.getCategoryById);

// Update category
router.put("/:categoryId", mainCategoryController.updateCategory);

// Delete category
router.delete("/:categoryId", mainCategoryController.deleteCategory);

module.exports = router;

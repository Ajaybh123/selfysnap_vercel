const MainCategoryService = require("../services/MainCategoryService"); // ✅ Make sure path is correct

const createCategory = async (req, res) => {
  try {
    const category = await MainCategoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await MainCategoryService.getAllCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await MainCategoryService.updateCategory(
      req.params.categoryId,
      req.body
    );
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const result = await MainCategoryService.deleteCategory(req.params.categoryId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await MainCategoryService.getCategoryById(req.params.categoryId);
    res.json(category);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryById
};

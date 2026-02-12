const MainCategory = require("../models/MainCategory");

class MainCategoryService {
  async createCategory(data) {
    const { name, parentCategoryId, level } = data;

    const categoryId = parentCategoryId
      ? `${parentCategoryId}_${name.toLowerCase().replace(/\s+/g, "_")}`
      : name.toLowerCase().replace(/\s+/g, "_");

    const existing = await MainCategory.findOne({ categoryId });
    if (existing) {
      throw new Error("Category with this ID already exists");
    }

    let parentCategoryName = null;
    if (parentCategoryId) {
      const parent = await MainCategory.findOne({ categoryId: parentCategoryId });
      if (!parent) throw new Error("Parent category not found");
      parentCategoryName = parent.name;
    }

    const category = new MainCategory({
      name,
      categoryId,
      parentCategoryId: parentCategoryId || null,
      parentCategoryName,
      level,
    });

    return await category.save();
  }

  async getAllCategories() {
    return await MainCategory.find().sort({ level: 1, name: 1 });
  }

  async updateCategory(categoryId, data) {
    const category = await MainCategory.findOneAndUpdate(
      { categoryId },
      data,
      { new: true }
    );
    if (!category) throw new Error("Category not found");
    return category;
  }

  async deleteCategory(categoryId) {
    const category = await MainCategory.findOne({ categoryId });
    if (!category) throw new Error("Category not found");

    const children = await MainCategory.find({ parentCategoryId: categoryId });
    if (children.length > 0) {
      throw new Error("Cannot delete category with child categories");
    }

    await MainCategory.deleteOne({ categoryId });
    return { message: "Category deleted successfully" };
  }

  async getCategoryById(categoryId) {
    const category = await MainCategory.findOne({ categoryId });
    if (!category) throw new Error("Category not found");
    return category;
  }
}

module.exports = new MainCategoryService(); // ✅ CJS style

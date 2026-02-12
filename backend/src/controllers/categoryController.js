const Category = require("../models/Category");
const Product = require("../models/Product");

const getCategories = async (req, res) => {
  try {
    // Step 1: Find all category IDs that exist in products
    const categoriesWithProducts = await Product.distinct("category"); 
    // returns array of ObjectIds of categories that have at least 1 product

    // Step 2: Fetch only categories whose _id is in categoriesWithProducts
    const categories = await Category.find({ _id: { $in: categoriesWithProducts } })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

module.exports = {
  getCategories,
};

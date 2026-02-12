const Product = require("../models/Product");
const HomeSection = require("../models/HomeSection");

class HomeSectionService {

  async createSection(data) {
    return await HomeSection.create(data);
  }

  async getAllSections() {
    return await HomeSection.find()
      .sort({ order: 1 })
      .populate("category");
  }

async getActiveSectionsWithProducts() {

  const sections = await HomeSection.find({ isActive: true })
    .sort({ order: 1 })
    .populate("category", "categoryId"); // section slug

  const result = [];

  for (const section of sections) {

    const products = await Product.find({
      category: section.category._id
    })
    .populate({
      path: "category",
      select: "categoryId name"
    })
    .limit(section.limit || 8);

    const mappedProducts = products.map(p => ({
      _id: p._id,
      title: p.title,
      images: p.images,
      categoryId: p.category.categoryId, // 🔥 slug
    }));

    result.push({
      _id: section._id,
      title: section.title,
      layout: section.layout,
      order: section.order,
      categoryId: section.category.categoryId, // see more slug
      products: mappedProducts,
    });
  }

  return result;
}


  async updateSection(id, data) {
    return await HomeSection.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteSection(id) {
    return await HomeSection.findByIdAndDelete(id);
  }
}

module.exports = new HomeSectionService();

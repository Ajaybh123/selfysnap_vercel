const HomeCategory = require('../models/HomeCategory');

class HomeCategoryService {
 
    // Create a single home category
    async createHomeCategory(homeCategory) {
        return await HomeCategory.create(homeCategory);
    }

    // Create multiple home categories
    async createCategories(homeCategories) {
        return await HomeCategory.insertMany(homeCategories);
    }

    // Update an existing home category
    async updateHomeCategory(category, id) {
        const existingCategory = await HomeCategory.findById(id);
        if (!existingCategory) {
            throw new Error("Category not found");
        }

    
        
        return await HomeCategory.findByIdAndUpdate(existingCategory._id,category,{new : true});
    }

    // Get all home categories
    async getAllHomeCategories() {
        return await HomeCategory.find();
    }

    // Delete a home category
    async deleteHomeCategory(id) {
        const existingCategory = await HomeCategory.findById(id);
        if (!existingCategory) {
            throw new Error("Category not found");
        }
        return await HomeCategory.findByIdAndDelete(id);
    }
}

module.exports = new HomeCategoryService();

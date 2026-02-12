const HomeCategoryService = require('../services/HomeCategoryService');
const HomeService = require('../services/HomeService');

class HomeCategoryController {

    // Create Home Categories
    async createHomeCategories(req, res) {
        try {
            const homeCategories = req.body; 
            const categories = await HomeCategoryService.createCategories(homeCategories);
            // Return only the created categories, not the entire home page structure
            return res.status(201).json({
                message: "Categories created successfully",
                data: categories
            }); 
        } catch (error) {
            return res.status(500).json({ message: error.message }); // Handle errors
        }
    }

    // Get All Home Categories
    async getHomeCategory(req, res) {
        try {
            const categories = await HomeCategoryService.getAllHomeCategories();
            return res.status(200).json(categories); // Send all categories with 200 OK
        } catch (error) {
            return res.status(500).json({ message: error.message }); // Handle errors
        }
    }

    // Update Home Category
    async updateHomeCategory(req, res) {
        try {
            const id = req.params.id; // Get ID from route params
            const homeCategory = req.body; // Get updated category from request body
            const updatedCategory = await HomeCategoryService.updateHomeCategory(homeCategory, id);
            return res.status(200).json(updatedCategory); // Send updated category with 200 OK
        } catch (error) {
            return res.status(500).json({ message: error.message }); // Handle errors
        }
    }

    // Get organized home page data
    async getHomePageData(req, res) {
        try {
            const homePageData = await HomeService.getHomePageData();
            return res.status(200).json(homePageData); // Send organized home page data with 200 OK
        } catch (error) {
            return res.status(500).json({ message: error.message }); // Handle errors
        }
    }

    // Delete Home Category
    async deleteHomeCategory(req, res) {
        try {
            const id = req.params.id; // Get ID from route params
            const deletedCategory = await HomeCategoryService.deleteHomeCategory(id);
            return res.status(200).json({
                message: "Category deleted successfully",
                data: deletedCategory
            }); // Send deleted category with 200 OK
        } catch (error) {
            return res.status(500).json({ message: error.message }); // Handle errors
        }
    }
}

module.exports = new HomeCategoryController();

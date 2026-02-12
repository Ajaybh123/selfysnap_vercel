const HomeCategorySection = require('../domain/HomeCategorySection');
const Deal = require('../models/Deal');

class HomeService {
    async createHomePageData(allCategories) {
        // Filter categories based on their section
        const gridCategories = allCategories.filter(category => 
            category.section === HomeCategorySection.GRID
        );

        const shopByCategories = allCategories.filter(category => 
            category.section === HomeCategorySection.SHOP_BY_CATEGORIES
        );

        const electricCategories = allCategories.filter(category => 
            category.section === HomeCategorySection.ELECTRIC_CATEGORIES
        );

        const dealCategories = allCategories.filter(category => 
            category.section === HomeCategorySection.DEALS
        );

        // Fetch existing deals (don't auto-create new ones)
        const deals = await Deal.find().populate("category");

        const home = {
            grid: gridCategories,
            shopByCategories: shopByCategories,
            electricCategories: electricCategories,
            dealCategories: dealCategories,
            deals: deals
        };

        return home; 
    }

    // Fetch and organize all home page data
    async getHomePageData() {
        const HomeCategory = require('../models/HomeCategory');
        
        // Fetch all home categories
        const allCategories = await HomeCategory.find();

        // Filter categories based on their section
        const gridCategories = allCategories.filter(category => 
            category.section === HomeCategorySection.GRID
        );

        const shopByCategories = allCategories.filter(category => 
            category.section === HomeCategorySection.SHOP_BY_CATEGORIES
        );

        const electricCategories = allCategories.filter(category => 
            category.section === HomeCategorySection.ELECTRIC_CATEGORIES
        );

        const dealCategories = allCategories.filter(category => 
            category.section === HomeCategorySection.DEALS
        );

        // Fetch deals
        const deals = await Deal.find().populate("category");

        const home = {
            grid: gridCategories,
            shopByCategories: shopByCategories,
            electricCategories: electricCategories,
            dealCategories: dealCategories,
            deals: deals
        };

        return home;
    }
}

module.exports = new HomeService();

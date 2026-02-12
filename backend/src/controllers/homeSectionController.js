const HomeSectionService = require("../services/HomeSectionService");
const { createHomeSectionSchema } = require("../validators/homeSectionvalidators");
const Yup = require("yup");

class HomeSectionController {

  // ADMIN: Create section
  async createSection(req, res) {
    try {
      await createHomeSectionSchema.validate(req.body, {
        abortEarly: false
      });

      const section = await HomeSectionService.createSection(req.body);

      res.status(201).json(section);

    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        return res.status(400).json({
          error: "Validation error",
          errors: error.errors,
          count: error.errors.length
        });
      }

      res.status(400).json({ error: error.message });
    }
  }

  // ADMIN: Get all sections
  async getAllSections(req, res) {
    try {
      const sections = await HomeSectionService.getAllSections();
      res.status(200).json(sections);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // FRONTEND: Homepage sections with products
  async getHomepageSections(req, res) {
    try {
      const sections =
        await HomeSectionService.getActiveSectionsWithProducts();

      res.status(200).json(sections);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Update section
  async updateSection(req, res) {
    try {
      const section = await HomeSectionService.updateSection(
        req.params.id,
        req.body
      );

      res.status(200).json(section);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  // Delete section
  async deleteSection(req, res) {
    try {
      await HomeSectionService.deleteSection(req.params.id);
      res.status(200).json({ message: "Section deleted successfully" });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new HomeSectionController();

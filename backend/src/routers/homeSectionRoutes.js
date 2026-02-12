const express = require("express");
const router = express.Router();

const HomeSectionController =
  require("../controllers/homeSectionController");

// Admin
router.post("/", HomeSectionController.createSection);
router.get("/", HomeSectionController.getAllSections);
router.put("/:id", HomeSectionController.updateSection);
router.delete("/:id", HomeSectionController.deleteSection);

// Frontend
router.get("/homepage", HomeSectionController.getHomepageSections);

module.exports = router;

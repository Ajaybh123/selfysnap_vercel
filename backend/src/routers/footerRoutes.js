const router = require("express").Router();
const controller = require("../controllers/footerController");

router.post("/", controller.createFooter);
router.get("/", controller.getFooters);
router.get("/:id", controller.getFooter);
router.put("/:id", controller.updateFooter);
router.delete("/:id", controller.deleteFooter);

module.exports = router;

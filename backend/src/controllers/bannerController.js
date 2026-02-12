const bannerService = require("../services/BannerService");

// CREATE
const createBanner = async (req, res) => {
  try {
    const { name, image, order } = req.body;

    if (!name || !image) {
      return res.status(400).json({ message: "Name & Image required" });
    }

    const banner = await bannerService.createBanner({
      name,
      image,
      order,
    });

    res.status(201).json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET ALL
const getBanners = async (req, res) => {
  try {
    const banners = await bannerService.getAllBanners();
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
const updateBanner = async (req, res) => {
  try {
    const banner = await bannerService.updateBanner(
      req.params.id,
      req.body
    );

    res.json(banner);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
const deleteBanner = async (req, res) => {
  try {
    await bannerService.deleteBanner(req.params.id);
    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createBanner,
  getBanners,
  updateBanner,
  deleteBanner,
};

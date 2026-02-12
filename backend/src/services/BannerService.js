const Banner = require("../models/Banner");

const createBanner = async (data) => {
  return await Banner.create(data);
};

const getAllBanners = async () => {
  return await Banner.find({ isActive: true }).sort({ order: 1 });
};

const updateBanner = async (id, data) => {
  return await Banner.findByIdAndUpdate(id, data, { new: true });
};

const deleteBanner = async (id) => {
  return await Banner.findByIdAndDelete(id);
};

module.exports = {
  createBanner,
  getAllBanners,
  updateBanner,
  deleteBanner,
};

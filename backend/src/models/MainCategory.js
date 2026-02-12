// models/MainCategory.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    parentCategoryId: {
      type: String,
      default: null,
    },
    parentCategoryName: {
      type: String,
      default: null,
    },
    level: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const MainCategory = mongoose.model("MainCategory", categorySchema);
module.exports = MainCategory; // ✅ CJS style

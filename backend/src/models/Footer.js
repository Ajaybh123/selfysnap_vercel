const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
  label: String,
  url: String,
});

const sectionSchema = new mongoose.Schema({
  title: String,
  links: [linkSchema],
});

const footerSchema = new mongoose.Schema(
  {
    sections: [sectionSchema],

    address: {
      company: String,
      line1: String,
      line2: String,
      country: String,
    },

    bottomLinks: [linkSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Footer", footerSchema);

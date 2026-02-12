const Yup = require("yup");

const createHomeSectionSchema = Yup.object().shape({
  title: Yup.string().required("Section title is required"),

  category: Yup.string()
    .required("Category is required"),

  tag: Yup.string()
    .oneOf(["bestseller", "popular", "seasonal"])
    .required("Tag is required"),

  limit: Yup.number()
    .min(1)
    .max(50)
    .default(8),

  layout: Yup.string()
    .oneOf(["slider", "grid"])
    .default("slider"),

  order: Yup.number()
    .required("Order is required"),

  isActive: Yup.boolean().default(true)
});

module.exports = {
  createHomeSectionSchema
};

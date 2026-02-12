import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { createHomeCategories, fetchHomePageData } from "../../../Redux Toolkit/Customer/Customer/AsyncThunk";
import { useEffect, useState } from "react";
import { api } from "../../../Config/Api";
import { HomeCategorySection } from "../../../domain/HomeCategorySection";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Category name is required"),
  image: Yup.string()
    .required("Image URL is required")
    .url("Must be a valid URL"),
  categoryId: Yup.string().required("Please select a category"),
  section: Yup.string().required("Please select a section"),
});

const AddHomeCategoryForm = () => {
  const dispatch = useAppDispatch();
  const { homePage } = useAppSelector((store) => store);

  // Category hierarchy states
  const [mainCategories, setMainCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [childCategories, setChildCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch main categories on component mount
  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await api.get("/api/admin/main-categories");
        // Filter for level 1 categories (main categories)
        const mainCats = response.data.filter(
          (cat: any) => cat.level === 1
        );
        setMainCategories(mainCats);
        setError(null);
      } catch (err: any) {
        setError("Failed to load categories");
        console.error("Error fetching categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchMainCategories();
  }, []);

  // Fetch sub categories when main category is selected
  const handleMainCategoryChange = async (mainCategoryId: string) => {
    formik.setFieldValue("categoryId", mainCategoryId);
    formik.setFieldValue("parentCategoryId", mainCategoryId);
    
    if (!mainCategoryId) {
      setSubCategories([]);
      setChildCategories([]);
      return;
    }

    try {
      setLoadingCategories(true);
      const response = await api.get("/api/admin/main-categories");
      // Filter for level 2 categories that have this as parent
      const subCats = response.data.filter(
        (cat: any) =>
          cat.level === 2 && cat.parentCategoryId === mainCategoryId
      );
      setSubCategories(subCats);
      setChildCategories([]);
      setError(null);
    } catch (err: any) {
      setError("Failed to load sub categories");
      console.error("Error fetching sub categories:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch child categories when sub category is selected
  const handleSubCategoryChange = async (subCategoryId: string) => {
    formik.setFieldValue("categoryId", subCategoryId);
    
    if (!subCategoryId) {
      setChildCategories([]);
      return;
    }

    try {
      setLoadingCategories(true);
      const response = await api.get("/api/admin/main-categories");
      // Filter for level 3 categories that have this as parent
      const childCats = response.data.filter(
        (cat: any) =>
          cat.level === 3 && cat.parentCategoryId === subCategoryId
      );
      setChildCategories(childCats);
      setError(null);
    } catch (err: any) {
      setError("Failed to load child categories");
      console.error("Error fetching child categories:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Handle child category selection
  const handleChildCategoryChange = (childCategoryId: string) => {
    formik.setFieldValue("categoryId", childCategoryId);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      image: "",
      categoryId: "",
      parentCategoryId: "",
      section: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setSuccessMessage(null);
        const homeCategoryData = {
          name: values.name,
          image: values.image,
          categoryId: values.categoryId,
          section: values.section,
        };

        await dispatch(createHomeCategories([homeCategoryData])).unwrap();
        
        // Refresh data from backend after successful creation
        setTimeout(() => {
          dispatch(fetchHomePageData() as any);
        }, 500);
        
        setSuccessMessage("Home category created successfully!");
        formik.resetForm();
        setSubCategories([]);
        setChildCategories([]);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err: any) {
        setError(err || "Failed to create home category");
        console.error("Error creating home category:", err);
      }
    },
  });

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{ maxWidth: 600, margin: "auto", padding: 3 }}
      className="space-y-6"
    >
      <Typography className="text-center" variant="h4" gutterBottom>
        Add New Home Category
      </Typography>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Success Alert */}
      {successMessage && (
        <Alert severity="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      {/* Category Name */}
      <TextField
        fullWidth
        id="name"
        name="name"
        label="Category Name"
        placeholder="Enter category name (e.g., Electronics, Fashion)"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
      />

      {/* Image URL */}
      <TextField
        fullWidth
        id="image"
        name="image"
        label="Image URL"
        placeholder="https://example.com/image.jpg"
        value={formik.values.image}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.image && Boolean(formik.errors.image)}
        helperText={formik.touched.image && formik.errors.image}
      />

      {/* Main Category Selection */}
      <FormControl
        fullWidth
        error={
          formik.touched.parentCategoryId &&
          Boolean(formik.errors.parentCategoryId)
        }
        required
      >
        <InputLabel id="main-category-label">
          {loadingCategories ? "Loading Main Categories..." : "Main Category"}
        </InputLabel>
        <Select
          labelId="main-category-label"
          id="main-category"
          label="Main Category"
          value={formik.values.parentCategoryId}
          onChange={(e) => handleMainCategoryChange(e.target.value)}
          disabled={loadingCategories}
        >
          <MenuItem value="">-- Select Main Category --</MenuItem>
          {mainCategories.map((category) => (
            <MenuItem key={category._id} value={category.categoryId}>
              {category.name} (Level 1)
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Sub Category Selection */}
      {subCategories.length > 0 && (
        <FormControl fullWidth>
          <InputLabel id="sub-category-label">Sub Category (Optional)</InputLabel>
          <Select
            labelId="sub-category-label"
            id="sub-category"
            label="Sub Category"
            value={formik.values.categoryId === formik.values.parentCategoryId ? "" : formik.values.categoryId}
            onChange={(e) => handleSubCategoryChange(e.target.value)}
            disabled={loadingCategories}
          >
            <MenuItem value="">-- No Sub Category --</MenuItem>
            {subCategories.map((category) => (
              <MenuItem key={category._id} value={category.categoryId}>
                {category.name} (Level 2)
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            Select a sub category if you want to use level 2 categories
          </FormHelperText>
        </FormControl>
      )}

      {/* Child Category Selection */}
      {childCategories.length > 0 && (
        <FormControl fullWidth>
          <InputLabel id="child-category-label">Child Category (Optional)</InputLabel>
          <Select
            labelId="child-category-label"
            id="child-category"
            label="Child Category"
            value={
              childCategories.some((cat) => cat.categoryId === formik.values.categoryId)
                ? formik.values.categoryId
                : ""
            }
            onChange={(e) => handleChildCategoryChange(e.target.value)}
            disabled={loadingCategories}
          >
            <MenuItem value="">-- No Child Category --</MenuItem>
            {childCategories.map((category) => (
              <MenuItem key={category._id} value={category.categoryId}>
                {category.name} (Level 3)
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            Select a child category if available for this sub category
          </FormHelperText>
        </FormControl>
      )}

      {/* Section Selection */}
      <FormControl
        fullWidth
        error={formik.touched.section && Boolean(formik.errors.section)}
        required
      >
        <InputLabel id="section-label">Section</InputLabel>
        <Select
          labelId="section-label"
          id="section"
          name="section"
          value={formik.values.section}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          label="Section"
        >
          <MenuItem value="">-- Select Section --</MenuItem>
          <MenuItem value={HomeCategorySection.ELECTRIC_CATEGORIES}>
            Electric Categories
          </MenuItem>
          <MenuItem value={HomeCategorySection.GRID}>Grid</MenuItem>
          <MenuItem value={HomeCategorySection.SHOP_BY_CATEGORIES}>
            Shop By Categories
          </MenuItem>
          <MenuItem value={HomeCategorySection.DEALS}>Deals</MenuItem>
        </Select>
        {formik.touched.section && formik.errors.section && (
          <FormHelperText>{formik.errors.section}</FormHelperText>
        )}
      </FormControl>

      {/* Selected Category Display */}
      {formik.values.categoryId && (
        <Box
          sx={{
            p: 2,
            backgroundColor: "#f5f5f5",
            borderRadius: 1,
            border: "1px solid #ddd",
          }}
        >
          <Typography variant="subtitle2" color="textSecondary">
            📌 Selected Category ID:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {formik.values.categoryId}
          </Typography>
        </Box>
      )}

      {/* Submit Button */}
      <Button
        color="primary"
        variant="contained"
        fullWidth
        type="submit"
        disabled={homePage.loading || loadingCategories}
        sx={{ py: ".9rem" }}
      >
        {homePage.loading ? <CircularProgress size={24} /> : "Add Home Category"}
      </Button>
    </Box>
  );
};

export default AddHomeCategoryForm;

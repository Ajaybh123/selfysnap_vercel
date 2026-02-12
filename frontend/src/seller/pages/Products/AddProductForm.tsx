import { useFormik } from "formik";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
  Grid,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import "tailwindcss/tailwind.css";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloseIcon from "@mui/icons-material/Close";
import { colors } from "../../../data/Filter/color";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { createProduct } from "../../../Redux Toolkit/Seller/sellerProductSlice";
import { uploadToCloudinary } from "../../../util/uploadToCloudnary";
import { api } from "../../../Config/Api";
import React, { useState, useEffect } from "react";

interface AddProductFormProps {
  initialValues?: any;
  mode?: "add" | "edit";
  onSubmit?: (values: any) => void;
  onClose?: () => void;
}

const defaultInitialValues = {
  title: "",
  description: "",
  mrpPrice: "",
  sellingPrice: "",
  quantity: "",
  color: "",
  images: [],
  category: "",
  category2: "",
  category3: "",
  sizes: "",
};

const AddProductForm: React.FC<AddProductFormProps> = ({
  initialValues = defaultInitialValues,
  mode = "add",
  onSubmit,
  onClose,
}) => {
  const [uploadImage, setUploadingImage] = useState(false);
  const dispatch = useAppDispatch();
  const { sellerProduct } = useAppSelector((store) => store);
  const [snackbarOpen, setOpenSnackbar] = useState(false);

  // Category hierarchy states
  const [mainCategories, setMainCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [childCategories, setChildCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (onSubmit) {
        onSubmit(values);
      } else {
        dispatch(
          createProduct({ request: values, jwt: localStorage.getItem("jwt") })
        );
      }
      console.log(values);
    },
  });

  const handleImageChange = async (event: any) => {
    const file = event.target.files[0];
    setUploadingImage(true);
    const image = await uploadToCloudinary(file);
    // const image = URL.createObjectURL(file);
    formik.setFieldValue("images", [...formik.values.images, image]);
    setUploadingImage(false);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...formik.values.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue("images", updatedImages);
  };

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
    formik.setFieldValue("category", mainCategoryId);
    formik.setFieldValue("category2", "");
    formik.setFieldValue("category3", "");
    
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
    formik.setFieldValue("category2", subCategoryId);
    formik.setFieldValue("category3", "");
    
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
    formik.setFieldValue("category3", childCategoryId);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (sellerProduct.productCreated || sellerProduct.error) {
      setOpenSnackbar(true);
    }
  }, [sellerProduct.productCreated, sellerProduct.error]);

  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="space-y-4 p-4">
        <Grid container spacing={2}>
          <Grid className="flex flex-wrap gap-5" size={{ xs: 12 }}>
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />

            <label className="relative" htmlFor="fileInput">
              <span className="w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-400">
                <AddPhotoAlternateIcon className="text-gray-700" />
              </span>
              {uploadImage && (
                <div className="absolute left-0 right-0 top-0 bottom-0 w-24 h-24 flex justify-center items-center">
                  <CircularProgress />
                </div>
              )}
            </label>

            <div className="flex flex-wrap gap-2">
              {formik.values.images.map((image: any, index: any) => (
                <div className="relative">
                  <img
                    className="w-24 h-24 object-cover"
                    key={index}
                    src={image}
                    alt={`ProductImage ${index + 1}`}
                  />
                  <IconButton
                    onClick={() => handleRemoveImage(index)}
                    className=""
                    size="small"
                    color="error"
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      outline: "none",
                    }}
                  >
                    <CloseIcon sx={{ fontSize: "1rem" }} />
                  </IconButton>
                </div>
              ))}
            </div>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              multiline
              rows={4}
              fullWidth
              id="description"
              name="description"
              label="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              // helperText={formik.touched.description && formik.errors.description}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <TextField
              fullWidth
              id="mrp_price"
              name="mrpPrice"
              label="MRP Price"
              type="number"
              value={formik.values.mrpPrice}
              onChange={formik.handleChange}
              error={formik.touched.mrpPrice && Boolean(formik.errors.mrpPrice)}
              // helperText={formik.touched.mrpPrice && formik.errors.mrpPrice}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <TextField
              fullWidth
              id="sellingPrice"
              name="sellingPrice"
              label="Selling Price"
              type="number"
              value={formik.values.sellingPrice}
              onChange={formik.handleChange}
              error={
                formik.touched.sellingPrice &&
                Boolean(formik.errors.sellingPrice)
              }
              // helperText={
              //   formik.touched.sellingPrice && formik.errors.sellingPrice
              // }
              required
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <FormControl
              fullWidth
              error={formik.touched.color && Boolean(formik.errors.color)}
              required
            >
              <InputLabel id="color-label">Color</InputLabel>
              <Select
                labelId="color-label"
                id="color"
                name="color"
                value={formik.values.color}
                onChange={formik.handleChange}
                label="Color"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>

                {colors.map((color) => (
                  <MenuItem value={color.name}>
                    <div className="flex gap-3">
                      <span
                        style={{ backgroundColor: color.hex }}
                        className={`h-5 w-5 rounded-full ${
                          color.name === "White" ? "border" : ""
                        }`}
                      ></span>
                      <p>{color.name}</p>
                    </div>
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.color && formik.errors.color && (
                <FormHelperText>
                  {typeof formik.errors.color === "string"
                    ? formik.errors.color
                    : undefined}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <FormControl
              fullWidth
              error={formik.touched.sizes && Boolean(formik.errors.sizes)}
              required
            >
              <InputLabel id="sizes-label">Sizes</InputLabel>
              <Select
                labelId="sizes-label"
                id="sizes"
                name="sizes"
                value={formik.values.sizes}
                onChange={formik.handleChange}
                label="Sizes"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="FREE">FREE</MenuItem>
                <MenuItem value="S">S</MenuItem>
                <MenuItem value="M">M</MenuItem>
                <MenuItem value="L">L</MenuItem>
                <MenuItem value="XL">XL</MenuItem>
              </Select>
           
            </FormControl>
          </Grid>
          {mode == "add" && (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <FormControl
                fullWidth
                error={
                  formik.touched.category && Boolean(formik.errors.category)
                }
                required
                disabled={loadingCategories}
              >
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={formik.values.category}
                  onChange={(e) => handleMainCategoryChange(e.target.value)}
                  label="Category"
                >
                  {mainCategories.map((item) => (
                    <MenuItem key={item.categoryId} value={item.categoryId}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
                {error && <FormHelperText error>{error}</FormHelperText>}
              </FormControl>
            </Grid>
          )}

          {mode == "add" && (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <FormControl
                fullWidth
                error={
                  formik.touched.category && Boolean(formik.errors.category)
                }
                required
                disabled={!formik.values.category}
              >
                <InputLabel id="category2-label">Second Category</InputLabel>
                <Select
                  labelId="category2-label"
                  id="category2"
                  name="category2"
                  value={formik.values.category2}
                  onChange={(e) => handleSubCategoryChange(e.target.value)}
                  label="Second Category"
                >
                  {subCategories.map((item) => (
                    <MenuItem key={item.categoryId} value={item.categoryId}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          {mode == "add" && (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <FormControl
                fullWidth
                error={
                  formik.touched.category && Boolean(formik.errors.category)
                }
                required
                disabled={!formik.values.category2}
              >
                <InputLabel id="category3-label">Third Category</InputLabel>
                <Select
                  labelId="category3-label"
                  id="category3"
                  name="category3"
                  value={formik.values.category3}
                  onChange={(e) => handleChildCategoryChange(e.target.value)}
                  label="Third Category"
                >
                  {childCategories.map((item) => (
                    <MenuItem key={item.categoryId} value={item.categoryId}>
                      {item.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          <Grid size={12}>
            <Button
              sx={{ p: "14px" }}
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              disabled={sellerProduct.loading}
            >
              {sellerProduct.loading ? (
                <CircularProgress
                  size="small"
                  sx={{ width: "27px", height: "27px" }}
                />
              ) : mode === "edit" ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </Button>
          </Grid>
          {onClose && (
            <Grid size={12}>
              <Button onClick={onClose} color="secondary" fullWidth>
                Cancel
              </Button>
            </Grid>
          )}
        </Grid>
      </form>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={sellerProduct.error ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {sellerProduct.error
            ? sellerProduct.error
            : "Product created successfully"}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddProductForm;

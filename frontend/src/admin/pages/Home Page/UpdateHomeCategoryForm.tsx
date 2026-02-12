import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Button,
  TextField,
  Typography,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Box,
  FormHelperText,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useAppDispatch } from "../../../Redux Toolkit/Store";
import { updateHomeCategory } from "../../../Redux Toolkit/Admin/AdminSlice";
import { useEffect, useState } from "react";
import { api } from "../../../Config/Api";
import type { HomeCategory } from "../../../types/homeDataTypes";

/* ---------------- VALIDATION ---------------- */

const validationSchema = Yup.object({
  image: Yup.string().required("Image is required"),
  category: Yup.string().required("Category is required"),
});

/* ---------------- PROPS ---------------- */

interface UpdateHomeCategoryFormProps {
  category?: HomeCategory;
  handleClose: () => void;
}

/* ---------------- COMPONENT ---------------- */

const UpdateHomeCategoryForm = ({
  category,
  handleClose,
}: UpdateHomeCategoryFormProps) => {
  const dispatch = useAppDispatch();

  const [mainCategories, setMainCategories] = useState<HomeCategory[]>([]);
  const [subCategories, setSubCategories] = useState<HomeCategory[]>([]);
  const [childCategories, setChildCategories] = useState<HomeCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- FETCH MAIN CATEGORIES ---------------- */

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await api.get("/api/admin/main-categories");

        const mainCats: HomeCategory[] = res.data.filter(
          (cat: any) => cat.level === 1
        );

        setMainCategories(mainCats);
      } catch (err) {
        console.error(err);
        setError("Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchMainCategories();
  }, []);

  /* ---------------- FORMIK ---------------- */

  const formik = useFormik({
    initialValues: {
      image: category?.image ?? "",
      category: "",
      category2: "",
      category3: "",
    },
    validationSchema,
    onSubmit: (values) => {
      if (!category?._id) return;

      dispatch(
        updateHomeCategory({
          id: category._id, // ✅ string (MongoDB safe)
          data: {
            image: values.image,
            categoryId:
              values.category3 ||
              values.category2 ||
              values.category,
          },
        })
      );

      handleClose();
    },
  });

  /* ---------------- HANDLERS ---------------- */

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
      const res = await api.get("/api/admin/main-categories");

      const subCats: HomeCategory[] = res.data.filter(
        (cat: any) =>
          cat.level === 2 && cat.parentCategoryId === mainCategoryId
      );

      setSubCategories(subCats);
      setChildCategories([]);
    } catch (err) {
      console.error(err);
      setError("Failed to load sub categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSubCategoryChange = async (subCategoryId: string) => {
    formik.setFieldValue("category2", subCategoryId);
    formik.setFieldValue("category3", "");

    if (!subCategoryId) {
      setChildCategories([]);
      return;
    }

    try {
      setLoadingCategories(true);
      const res = await api.get("/api/admin/main-categories");

      const childCats: HomeCategory[] = res.data.filter(
        (cat: any) =>
          cat.level === 3 && cat.parentCategoryId === subCategoryId
      );

      setChildCategories(childCats);
    } catch (err) {
      console.error(err);
      setError("Failed to load child categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  const getDisplayName = (categoryId: string) => {
    const all = [...mainCategories, ...subCategories, ...childCategories];
    return all.find((c) => c.categoryId === categoryId)?.name ?? categoryId;
  };

  /* ---------------- UI ---------------- */

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{ maxWidth: 500, mx: "auto", p: 3 }}
      className="space-y-6"
    >
      <Typography variant="h5" fontWeight={600}>
        Update Category
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {/* IMAGE */}
      <TextField
        fullWidth
        label="Image URL"
        name="image"
        value={formik.values.image}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.image && Boolean(formik.errors.image)}
        helperText={formik.touched.image && formik.errors.image}
      />

      {/* MAIN CATEGORY */}
      <FormControl
        fullWidth
        error={formik.touched.category && Boolean(formik.errors.category)}
      >
        <InputLabel>Main Category</InputLabel>
        <Select
          value={formik.values.category}
          label="Main Category"
          onChange={(e) => handleMainCategoryChange(e.target.value)}
          disabled={loadingCategories}
        >
          <MenuItem value="">-- Select Main Category --</MenuItem>
          {mainCategories.map((item) => (
            <MenuItem key={item._id} value={item.categoryId}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          {formik.touched.category && formik.errors.category}
        </FormHelperText>
      </FormControl>

      {/* SUB CATEGORY */}
      {subCategories.length > 0 && (
        <FormControl fullWidth>
          <InputLabel>Sub Category (Optional)</InputLabel>
          <Select
            value={formik.values.category2}
            label="Sub Category"
            onChange={(e) => handleSubCategoryChange(e.target.value)}
          >
            <MenuItem value="">-- No Sub Category --</MenuItem>
            {subCategories.map((item) => (
              <MenuItem key={item._id} value={item.categoryId}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* CHILD CATEGORY */}
      {childCategories.length > 0 && (
        <FormControl fullWidth>
          <InputLabel>Child Category (Optional)</InputLabel>
          <Select
            value={formik.values.category3}
            label="Child Category"
            onChange={(e) =>
              formik.setFieldValue("category3", e.target.value)
            }
          >
            <MenuItem value="">-- No Child Category --</MenuItem>
            {childCategories.map((item) => (
              <MenuItem key={item._id} value={item.categoryId}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* SELECTED CATEGORY */}
      {(formik.values.category ||
        formik.values.category2 ||
        formik.values.category3) && (
        <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 1 }}>
          <Typography variant="caption">📌 Selected Category</Typography>
          <Typography fontWeight={600}>
            {getDisplayName(
              formik.values.category3 ||
                formik.values.category2 ||
                formik.values.category
            )}
          </Typography>
        </Box>
      )}

      {/* SUBMIT */}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loadingCategories}
      >
        {loadingCategories ? (
          <CircularProgress size={22} />
        ) : (
          "Update Category"
        )}
      </Button>
    </Box>
  );
};

export default UpdateHomeCategoryForm;

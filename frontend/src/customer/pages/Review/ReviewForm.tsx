import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Box,
  Rating,
  InputLabel,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { uploadToCloudinary } from "../../../util/uploadToCloudnary";
import { useAppDispatch } from "../../../Redux Toolkit/Store";
import { createReview } from "../../../Redux Toolkit/Customer/ReviewSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

interface CreateReviewRequest {
  reviewText: string;
  rating: number;
  productImages: string[];
}

const ReviewForm: React.FC = () => {
  const [uploadImage, setUploadingImage] = useState(false);
  const dispatch = useAppDispatch();
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const formik = useFormik<CreateReviewRequest>({
    initialValues: {
      reviewText: "",
      rating: 0,
      productImages: [],
    },
    validationSchema: Yup.object({
      reviewText: Yup.string()
        .required("Review text is required")
        .min(10, "Review must be at least 10 characters long"),
      rating: Yup.number()
        .required("Rating is required")
        .min(0)
        .max(5),
    }),
    onSubmit: (values) => {
      if (!productId) return;

      dispatch(
        createReview({
          productId,
          review: values,
          jwt: localStorage.getItem("jwt") || "",
          navigate,
        })
      );
    },
  });

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const imageUrl = await uploadToCloudinary(file);

    formik.setFieldValue("productImages", [
      ...formik.values.productImages,
      imageUrl,
    ]);

    setUploadingImage(false);
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...formik.values.productImages];
    updatedImages.splice(index, 1);
    formik.setFieldValue("productImages", updatedImages);
  };

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      noValidate
      sx={{ mt: 3 }}
      className="space-y-5"
    >
      {/* Review Text */}
      <TextField
        fullWidth
        id="reviewText"
        name="reviewText"
        label="Review Text"
        multiline
        rows={4}
        value={formik.values.reviewText}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.reviewText && Boolean(formik.errors.reviewText)}
        helperText={formik.touched.reviewText && formik.errors.reviewText}
      />

      {/* Rating */}
      <div className="space-y-2">
        <InputLabel>Rating</InputLabel>
        <Rating
          name="rating"
          value={formik.values.rating}
          precision={0.5}
          onChange={(_, newValue) => {
            formik.setFieldValue("rating", newValue ?? 0);
          }}
        />
        {formik.touched.rating && formik.errors.rating && (
          <Typography color="error" variant="body2">
            {formik.errors.rating}
          </Typography>
        )}
      </div>

      {/* Image Upload */}
      <div className="flex flex-wrap gap-5 py-3">
        <input
          type="file"
          accept="image/*"
          id="fileInput"
          hidden
          onChange={handleImageChange}
        />

        <label htmlFor="fileInput" className="relative">
          <span className="w-24 h-24 cursor-pointer flex items-center justify-center p-3 border rounded-md border-gray-400">
            <AddPhotoAlternateIcon className="text-gray-700" />
          </span>

          {uploadImage && (
            <div className="absolute inset-0 w-24 h-24 flex items-center justify-center">
              <CircularProgress size={24} />
            </div>
          )}
        </label>

        {/* Preview Images */}
        <div className="flex flex-wrap gap-2">
          {formik.values.productImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Product ${index + 1}`}
                className="w-24 h-24 object-cover rounded"
              />
              <IconButton
                size="small"
                color="error"
                onClick={() => handleRemoveImage(index)}
                sx={{ position: "absolute", top: 0, right: 0 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          ))}
        </div>
      </div>

      <Button variant="contained" color="primary" type="submit">
        Submit Review
      </Button>
    </Box>
  );
};

export default ReviewForm;

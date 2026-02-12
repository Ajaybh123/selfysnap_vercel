import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Switch,
  Button,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../Redux Toolkit/Store";
import { createHomeSection } from "../../../Redux Toolkit/Admin/HomeSectionSlice";
import { fetchCategories } from "../../../Redux Toolkit/Admin/CategorySlice";

// ================= TYPES =================
interface Category {
  _id: string;
  name: string;
  categoryId?: string;
}

interface HomeSectionFormType {
  title: string;
  category: string;
  tag: "bestseller" | "popular" | "seasonal";
  layout: "slider" | "grid";
  limit: number;
  order: number;
  isActive: boolean;
}

export default function HomeSectionForm() {
  const dispatch = useAppDispatch();

  const { categories, loading } = useAppSelector(
    (state) => state.category
  ) as { categories: Category[]; loading: boolean };

  const [form, setForm] = useState<HomeSectionFormType>({
    title: "",
    category: "",
    tag: "bestseller",
    layout: "slider",
    limit: 8,
    order: 1,
    isActive: true,
  });

  useEffect(() => {
    const jwt = "user-token-here"; // replace with your auth token
    dispatch(fetchCategories(jwt));
  }, [dispatch]);

  const handleSubmit = () => {
    if (!form.title || !form.category) {
      alert("Title & Category are required");
      return;
    }

    const jwt = "user-token-here";
    dispatch(createHomeSection({ section: form, jwt }));

    // Reset form
    setForm({
      title: "",
      category: "",
      tag: "bestseller",
      layout: "slider",
      limit: 8,
      order: 1,
      isActive: true,
    });
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 500, margin: "auto" }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Add Home Section
      </Typography>

      {/* Title */}
      <TextField
        fullWidth
        label="Title"
        variant="outlined"
        sx={{ mb: 2 }}
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      {/* Category */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={form.category}
          label="Category"
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <MenuItem value="">
            <em>Select Category</em>
          </MenuItem>
          {categories.map((c) => (
            <MenuItem key={c._id} value={c._id}>
              {c.name || c.categoryId}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Tag */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Tag</InputLabel>
        <Select
          value={form.tag}
          label="Tag"
          onChange={(e) =>
            setForm({ ...form, tag: e.target.value as HomeSectionFormType["tag"] })
          }
        >
          <MenuItem value="bestseller">Bestseller</MenuItem>
          <MenuItem value="popular">Popular</MenuItem>
          <MenuItem value="seasonal">Seasonal</MenuItem>
        </Select>
      </FormControl>

      {/* Layout */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Layout</InputLabel>
        <Select
          value={form.layout}
          label="Layout"
          onChange={(e) =>
            setForm({ ...form, layout: e.target.value as HomeSectionFormType["layout"] })
          }
        >
          <MenuItem value="slider">Slider</MenuItem>
          <MenuItem value="grid">Grid</MenuItem>
        </Select>
      </FormControl>

      {/* Order */}
      <TextField
        fullWidth
        type="number"
        label="Order"
        variant="outlined"
        sx={{ mb: 2 }}
        value={form.order}
        onChange={(e) =>
          setForm({ ...form, order: Number(e.target.value) })
        }
      />

      {/* Limit */}
      <TextField
        fullWidth
        type="number"
        label="Limit"
        variant="outlined"
        sx={{ mb: 2 }}
        value={form.limit}
        onChange={(e) =>
          setForm({ ...form, limit: Number(e.target.value) })
        }
      />

      {/* Active Switch */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <Typography>Active</Typography>
        <Switch
          checked={form.isActive}
          onChange={(e) =>
            setForm({ ...form, isActive: e.target.checked })
          }
        />
      </Box>

      {/* Submit */}
      <Button
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
        onClick={handleSubmit}
      >
        {loading ? "Saving..." : "Save"}
      </Button>
    </Paper>
  );
}

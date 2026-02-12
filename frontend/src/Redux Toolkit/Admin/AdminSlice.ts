import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { HomeCategory } from "../../types/homeDataTypes";
import { api } from "../../Config/Api";

const DEPLOYED_URL = "/home";

/* ============================
   UPDATE HOME CATEGORY
============================ */
export const updateHomeCategory = createAsyncThunk<
  HomeCategory,
  { id: string; data: Partial<HomeCategory> },
  { rejectValue: string }
>(
  "homeCategory/updateHomeCategory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `${DEPLOYED_URL}/home-category/${id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "An error occurred while updating the category"
      );
    }
  }
);

/* ============================
   FETCH HOME CATEGORIES
============================ */
export const fetchHomeCategories = createAsyncThunk<
  HomeCategory[],
  void,
  { rejectValue: string }
>(
  "homeCategory/fetchHomeCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${DEPLOYED_URL}/home-category`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

/* ============================
   SLICE STATE
============================ */
interface HomeCategoryState {
  categories: HomeCategory[];
  loading: boolean;
  error: string | null;
  categoryUpdated: boolean;
}

const initialState: HomeCategoryState = {
  categories: [],
  loading: false,
  error: null,
  categoryUpdated: false,
};

/* ============================
   SLICE
============================ */
const homeCategorySlice = createSlice({
  name: "homeCategory",
  initialState,
  reducers: {
    resetCategoryUpdated(state) {
      state.categoryUpdated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ===== UPDATE ===== */
      .addCase(updateHomeCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.categoryUpdated = false;
      })
      .addCase(updateHomeCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryUpdated = true;

        const index = state.categories.findIndex(
          (cat) => cat._id === action.payload._id
        );

        if (index !== -1) {
          state.categories[index] = action.payload;
        } else {
          state.categories.push(action.payload);
        }
      })
      .addCase(updateHomeCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Update failed";
      })

      /* ===== FETCH ===== */
      .addCase(fetchHomeCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchHomeCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Fetch failed";
      });
  },
});

/* ============================
   EXPORTS
============================ */
export const { resetCategoryUpdated } = homeCategorySlice.actions;
export default homeCategorySlice.reducer;

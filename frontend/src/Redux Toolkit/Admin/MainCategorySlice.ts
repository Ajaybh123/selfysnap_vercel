// src/redux/slices/mainCategorySlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { type MainCategory } from "../../types/mainCategoryTypes";
import { api } from "../../Config/Api";

const API_URL = "/api/admin/main-categories";

// ---------- State Type ----------
interface MainCategoryState {
  categories: MainCategory[];
  loading: boolean;
  error: string | null;
  categoryCreated: boolean;
  categoryUpdated: boolean;
}

// ---------- Initial State ----------
const initialState: MainCategoryState = {
  categories: [],
  loading: false,
  error: null,
  categoryCreated: false,
  categoryUpdated: false,
};

// ---------- Async Thunks ----------

// Create
export const createMainCategory = createAsyncThunk<
  MainCategory,
  { category: Partial<MainCategory>; jwt: string },
  { rejectValue: string }
>(
  "mainCategory/create",
  async ({ category, jwt }, { rejectWithValue }) => {
    try {
      // 🔑 payload ko level ke hisaab se banao
      const payload: any = {
        name: category.name,
        categoryId: category.categoryId,
        level: category.level,
      };

      // sirf level 2 & 3 me parent fields
      if (category.level !== 1) {
        payload.parentCategoryId = category.parentCategoryId || null;
        payload.parentCategoryName = category.parentCategoryName || null;
      }

      console.log("CREATE CATEGORY PAYLOAD 👉", payload);

      const res = await api.post(`${API_URL}/`, payload, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      });

      return res.data;
    } catch (error: any) {
      console.error("CREATE CATEGORY ERROR ❌", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create category"
      );
    }
  }
);


// Fetch All
export const fetchMainCategories = createAsyncThunk<
  MainCategory[],
  string,
  { rejectValue: string }
>("mainCategory/fetchAll", async (jwt, { rejectWithValue }) => {
  try {
    const res = await api.get(`${API_URL}/`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    return res.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to fetch categories");
  }
});

// Update
export const updateMainCategory = createAsyncThunk<
  MainCategory,
  { categoryId: string; data: Partial<MainCategory>; jwt: string },
  { rejectValue: string }
>("mainCategory/update", async ({ categoryId, data, jwt }, { rejectWithValue }) => {
  try {
    const res = await api.put(`${API_URL}/${categoryId}`, data, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    return res.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to update category");
  }
});

// Delete
export const deleteMainCategory = createAsyncThunk<
  string,
  { id: string; jwt: string },
  { rejectValue: string }
>("mainCategory/delete", async ({ id, jwt }, { rejectWithValue }) => {
  try {
    await api.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to delete category");
  }
});

// ---------- Slice ----------
const mainCategorySlice = createSlice({
  name: "mainCategory",
  initialState,
  reducers: {
    resetCategoryState: (state) => {
      state.categoryCreated = false;
      state.categoryUpdated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createMainCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.categoryCreated = false;
      })
      .addCase(createMainCategory.fulfilled, (state, action: PayloadAction<MainCategory>) => {
        state.loading = false;
        state.categories.push(action.payload);
        state.categoryCreated = true;
      })
      .addCase(createMainCategory.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Failed to create category";
      })

      // FETCH
      .addCase(fetchMainCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMainCategories.fulfilled, (state, action: PayloadAction<MainCategory[]>) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchMainCategories.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch categories";
      })

      // UPDATE
      .addCase(updateMainCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.categoryUpdated = false;
      })
      .addCase(updateMainCategory.fulfilled, (state, action: PayloadAction<MainCategory>) => {
        state.loading = false;
        const index = state.categories.findIndex((cat) => cat._id === action.payload._id);
        if (index !== -1) state.categories[index] = action.payload;
        state.categoryUpdated = true;
      })
      .addCase(updateMainCategory.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Failed to update category";
      })

      // DELETE
      .addCase(deleteMainCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMainCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter((cat) => cat._id !== action.payload);
      })
      .addCase(deleteMainCategory.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete category";
      });
  },
});

export const { resetCategoryState } = mainCategorySlice.actions;
export default mainCategorySlice.reducer;

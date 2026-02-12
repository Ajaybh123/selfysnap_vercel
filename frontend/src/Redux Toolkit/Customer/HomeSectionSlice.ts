// src/Redux Toolkit/Customer/HomeSectionSlice.ts
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../Config/Api"; // Axios instance with baseURL

/* ---------- Types ---------- */
export interface Product {
  _id: string;
  title: string;
  images?: string[];
  category: string;
  categoryId?: string; // optional
}

export interface HomeSection {
  _id: string;
  title: string;
  layout: "slider" | "grid";
  products?: Product[];
  category?: string; // optional for "See more" link
}

/* ---------- State ---------- */
interface HomeState {
  sections: HomeSection[];
  loading: boolean;
  error: string | null;
}

const initialState: HomeState = {
  sections: [],
  loading: false,
  error: null,
};

/* ---------- FETCH ---------- */
export const fetchHomeSections = createAsyncThunk<HomeSection[]>(
  "home/fetchSections",
  async () => {
    try {
      const res = await api.get("/api/admin/home-sections/homepage");
      console.log("API RAW RESPONSE:", res.data);

      // Support both response formats
      const data: HomeSection[] =
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];

      // Ensure each section has a category field if it has products
      const sectionsWithCategory = data.map((section) => ({
        ...section,
        category:
          section.category ??
          section.products?.[0]?.category ?? // fallback to first product's category
          undefined,
      }));

      return sectionsWithCategory;
    } catch (error: any) {
      console.error("Failed to fetch home sections:", error.response || error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch home sections"
      );
    }
  }
);

/* ---------- SLICE ---------- */
const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* FETCH */
      .addCase(fetchHomeSections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchHomeSections.fulfilled,
        (state, action: PayloadAction<HomeSection[]>) => {
          state.loading = false;
          state.sections = action.payload;
        }
      )
      .addCase(fetchHomeSections.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch home sections";
      });
  },
});

/* ---------- EXPORT REDUCER ---------- */
export default homeSlice.reducer;

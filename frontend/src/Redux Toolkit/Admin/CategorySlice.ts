import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";

const API_URL = "/api/admin/categories";

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (jwt: string) => {
    const res = await api.get(API_URL, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    return res.data.categories;
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default categorySlice.reducer;

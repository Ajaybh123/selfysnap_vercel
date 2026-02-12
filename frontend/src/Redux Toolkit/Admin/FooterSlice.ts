import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Footer, FooterPayload } from "../../types/footerTypes";

const API = "https://multivender-ecommerce-selfysnap-1.onrender.com/api/admin/footer";

interface FooterState {
  list: Footer[];
  loading: boolean;
}

/* THUNKS */
export const fetchFooters = createAsyncThunk<Footer[]>(
  "footer/fetch",
  async () => {
    const res = await axios.get(API);
    return res.data.data;
  }
);

export const createFooter = createAsyncThunk<Footer, FooterPayload>(
  "footer/create",
  async (data) => {
    const res = await axios.post(API, data);
    return res.data.data;
  }
);

export const updateFooter = createAsyncThunk<
  Footer,
  { id: string; data: Partial<FooterPayload> }
>("footer/update", async ({ id, data }) => {
  const res = await axios.put(`${API}/${id}`, data);
  return res.data.data;
});

export const deleteFooter = createAsyncThunk<string, string>(
  "footer/delete",
  async (id) => {
    await axios.delete(`${API}/${id}`);
    return id;
  }
);

const initialState: FooterState = {
  list: [],
  loading: false,
};

const footerSlice = createSlice({
  name: "footer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFooters.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(createFooter.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateFooter.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (f) => f._id === action.payload._id
        );
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteFooter.fulfilled, (state, action) => {
        state.list = state.list.filter(
          (f) => f._id !== action.payload
        );
      });
  },
});

export default footerSlice.reducer;

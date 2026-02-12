import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";

const DEPLOYED_URL = "/api/admin/banners";

/* ---------- Types ---------- */
export interface IBanner {
  _id?: string;
  name: string;
  image: string;
  order: number;
  isActive?: boolean;
  createdAt?: string;
}

/* ---------- State ---------- */
interface BannerState {
  banners: IBanner[];
  loading: boolean;
  error: string | null;
}

const initialState: BannerState = {
  banners: [],
  loading: false,
  error: null,
};

/* ---------- FETCH ---------- */
export const fetchBanners = createAsyncThunk<IBanner[]>(
  "banner/fetch",
  async () => {
    const res = await api.get(DEPLOYED_URL);

    console.log("API RAW RESPONSE:", res.data);

    // ✅ SUPPORT BOTH RESPONSE TYPES
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data?.data)) return res.data.data;

    return [];
  }
);

/* ---------- CREATE ---------- */
export const createBanner = createAsyncThunk<IBanner, IBanner>(
  "banner/create",
  async (payload) => {
    const res = await api.post(DEPLOYED_URL, payload);
    return res.data?.data || res.data;
  }
);

/* ---------- UPDATE ---------- */
export const updateBanner = createAsyncThunk<
  IBanner,
  { id: string; data: Partial<IBanner> }
>("banner/update", async ({ id, data }) => {
  const res = await api.put(`${DEPLOYED_URL}/${id}`, data);
  return res.data?.data || res.data;
});

/* ---------- DELETE ---------- */
export const deleteBanner = createAsyncThunk<string, string>(
  "banner/delete",
  async (id) => {
    await api.delete(`${DEPLOYED_URL}/${id}`);
    return id;
  }
);

/* ---------- SLICE ---------- */
const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* FETCH */
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload.sort(
          (a, b) => a.order - b.order
        );
      })
      .addCase(fetchBanners.rejected, (state) => {
        state.loading = false;
      })

      /* CREATE */
      .addCase(createBanner.fulfilled, (state, action) => {
        state.banners.push(action.payload);
        state.banners.sort((a, b) => a.order - b.order);
      })

      /* UPDATE */
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.banners = state.banners.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
      })

      /* DELETE */
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.banners = state.banners.filter(
          (b) => b._id !== action.payload
        );
      });
  },
});

export default bannerSlice.reducer;

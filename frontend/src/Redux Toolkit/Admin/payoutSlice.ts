import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";

// ================= TYPES =================
export interface Payouts {
  _id: string;
  amount: number;
  commission: number;
  status: string;
  seller: any;
}

export interface SellerSummary {
  sellerId: string;
  sellerName: string;
  total: number;
  weekly: number;
  monthly: number;
}

interface AdminPayoutsState {
  payouts: Payouts[];
  summary: SellerSummary[];
  loading: boolean;
  error: string | null;
}

// ================= INITIAL STATE =================
const initialState: AdminPayoutsState = {
  payouts: [],
  summary: [],
  loading: false,
  error: null,
};

// ================= THUNKS =================
export const fetchAdminPayouts = createAsyncThunk(
  "adminPayouts/fetchAdminPayouts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/payouts/admin");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch payouts"
      );
    }
  }
);

export const fetchPayoutSummary = createAsyncThunk(
  "adminPayouts/fetchPayoutSummary",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/payouts/summary");
      return res.data; // response object with summary
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch summary"
      );
    }
  }
);

export const updatePayoutStatus = createAsyncThunk(
  "adminPayouts/updatePayoutStatus",
  async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/api/payouts/${id}/status`, null, { params: { status } });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update status"
      );
    }
  }
);

// ================= SLICE =================
const adminPayoutSlice = createSlice({
  name: "adminPayouts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // ===== fetch payouts =====
    builder.addCase(fetchAdminPayouts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchAdminPayouts.fulfilled, (state, action) => {
      state.loading = false;
      state.payouts = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(fetchAdminPayouts.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });

    // ===== fetch summary =====
    builder.addCase(fetchPayoutSummary.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPayoutSummary.fulfilled, (state, action) => {
      state.loading = false;

      const sellerSummaryArray =
        action.payload?.summary?.sellerSummary && Array.isArray(action.payload.summary.sellerSummary)
          ? action.payload.summary.sellerSummary
          : [];

      const weekly = action.payload?.summary?.weekly || 0;
      const monthly = action.payload?.summary?.monthly || 0;

      state.summary = sellerSummaryArray.map((item: any) => ({
        sellerId: item.seller?._id || item._id,
        sellerName: item.seller?.sellerName || "Unknown",
        total: item.totalOrders || 0,
        weekly,
        monthly,
      }));
    });
    builder.addCase(fetchPayoutSummary.rejected, (state, action: any) => {
      state.loading = false;
      state.error = action.payload;
    });

    // ===== update payout status =====
    builder.addCase(updatePayoutStatus.fulfilled, (state, action) => {
      const index = state.payouts.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) {
        state.payouts[index] = action.payload;
      }
    });
  },
});

export default adminPayoutSlice.reducer;

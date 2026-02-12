import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";
import { type Payouts } from "../../types/payoutsType";

export const requestPayout = createAsyncThunk<
  Payouts,
  string,
  { rejectValue: string }
>("payouts/requestPayout", async (jwt, { rejectWithValue }) => {
  try {
    const response = await api.post<Payouts>("/api/payouts/request", {}, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      return rejectWithValue(error.response.data.message);
    }
    return rejectWithValue("Failed to request payout");
  }
});

const payoutRequestSlice = createSlice({
  name: "payoutRequest",
  initialState: { loading: false, error: null as string | null, success: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestPayout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(requestPayout.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(requestPayout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export default payoutRequestSlice.reducer;

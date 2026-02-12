import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";

interface DeliveryPartner {
  _id: string;
  name: string;
  email: string;
  phone: string;
  vehicleType?: string;
  currentOrder?: any;
  isAvailable?: boolean;
}

interface AdminDeliveryPartnersState {
  partners: DeliveryPartner[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminDeliveryPartnersState = {
  partners: [],
  loading: false,
  error: null,
};

export const fetchDeliveryPartners = createAsyncThunk<
  DeliveryPartner[],
  void,
  { rejectValue: string }
>(
  "adminDeliveryPartners/fetchDeliveryPartners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/delivery-partners/admin");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch partners"
      );
    }
  }
);

const adminDeliveryPartnersSlice = createSlice({
  name: "adminDeliveryPartners",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeliveryPartners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliveryPartners.fulfilled, (state, action) => {
        state.loading = false;
        state.partners = action.payload;
      })
      .addCase(fetchDeliveryPartners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch partners";
      });
  },
});

export default adminDeliveryPartnersSlice.reducer;

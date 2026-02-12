import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../Config/Api";
import { type Order } from "../../types/orderTypes";

interface AdminOrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminOrdersState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchAdminOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("adminOrders/fetchAdminOrders", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/api/orders/admin");
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch orders"
    );
  }
});

export const assignDeliveryPartner = createAsyncThunk<
  Order,
  { orderId: string; deliveryPartnerId: string },
  { rejectValue: string }
>(
  "adminOrders/assignDeliveryPartner",
  async ({ orderId, deliveryPartnerId }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/orders/${orderId}/assign-delivery`,
        { deliveryPartnerId }
      );
      return response.data.order;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Assign failed"
      );
    }
  }
);

export const updateDeliveryStatus = createAsyncThunk<
  Order,
  { orderId: string; status: string },
  { rejectValue: string }
>(
  "adminOrders/updateDeliveryStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/api/orders/${orderId}/delivery-status`,
        { status }
      );
      return response.data.order;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Status update failed"
      );
    }
  }
);

const adminOrdersSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(assignDeliveryPartner.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (o) => o._id === action.payload._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateDeliveryStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (o) => o._id === action.payload._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });
  },
});

export default adminOrdersSlice.reducer;

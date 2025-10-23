import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getAuthHeaders = () => {
  const userInfo = localStorage.getItem("userInfo");
  if (!userInfo) return {};

  const parsed = JSON.parse(userInfo);
  const token = parsed?.token;

  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : {};
};

export const createCheckout = createAsyncThunk(
  "checkout/createCheckout",
  async (checkoutdate, { rejectWithValue }) => {
    try {
      console.log("Headers being sent:", getAuthHeaders());
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      console.log("User info:", userInfo);
      console.log("Token:", userInfo?.token);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
        checkoutdate,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      return rejectWithValue({ message });
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkout: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export default checkoutSlice.reducer;

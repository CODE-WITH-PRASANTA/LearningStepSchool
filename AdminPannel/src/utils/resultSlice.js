import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api/axios";

// 🔥 FETCH RESULTS
export const fetchResults = createAsyncThunk(
  "results/fetchResults",
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get("/exam-results");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Fetch failed");
    }
  },
);

// 🔥 DELETE RESULT (optional async)
export const deleteResult = createAsyncThunk(
  "results/deleteResult",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/exam-results/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Delete failed");
    }
  },
);

const resultSlice = createSlice({
  name: "results",
  initialState: {
    data: [],
    loading: false,
    error: null,
    lastFetched: null,
  },

  reducers: {
    clearCache: (state) => {
      state.data = [];
      state.lastFetched = null;
    },

    // 🔥 OPTIMISTIC DELETE
    removeResult: (state, action) => {
      state.data = state.data.filter((item) => item._id !== action.payload);
    },
    updateResult: (state, action) => {
      state.data = state.data.map((item) =>
        item._id === action.payload._id ? action.payload : item,
      );
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= FETCH =================
      .addCase(fetchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchResults.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastFetched = Date.now();
      })

      .addCase(fetchResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch";
      })

      // ================= DELETE =================
      .addCase(deleteResult.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteResult.fulfilled, (state, action) => {
        state.loading = false;

        // ✅ remove from store
        state.data = state.data.filter((item) => item._id !== action.payload);
      })

      .addCase(deleteResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Delete failed";
      });
  },
});

export const { clearCache, removeResult,updateResult } = resultSlice.actions;
export default resultSlice.reducer;

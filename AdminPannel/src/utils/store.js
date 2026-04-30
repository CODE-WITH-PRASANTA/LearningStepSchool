import { configureStore } from "@reduxjs/toolkit";
import resultReducer from "./resultSlice";

export const store = configureStore({
  reducer: {
    results: resultReducer,
  },
});
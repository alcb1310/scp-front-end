import { createSlice } from "@reduxjs/toolkit";

export const tokenSlice = createSlice({
  name: "token",
  initialState: {
    value: "",
  },

  reducers: {
    save: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { save } = tokenSlice.actions;
export const token = state => state.token.value
export default tokenSlice.reducer;

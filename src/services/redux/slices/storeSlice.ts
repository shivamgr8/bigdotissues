import { createSlice } from "@reduxjs/toolkit";

export const storeSlice = createSlice({
  name: "globalconfig",
  initialState: {
    configTextSize: {
      heading: { size: 24, lineheight: 27 },
      text: { size: 17, lineheight: 22 },
      h2: { size: 22, lineheight: 26 },
      h3: { size: 20, lineheight: 24 },
      h4: { size: 18, lineheight: 22 },
    },
  },
  reducers: {
    updateTextSize: (state, action) => {
      //console.info(action.payload)
      state.configTextSize = action.payload;
    },
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload
    // }
  },
});

// Action creators are generated for each case reducer function
export const { updateTextSize } = storeSlice.actions;

export default storeSlice.reducer;

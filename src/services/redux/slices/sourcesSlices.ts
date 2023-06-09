import { createSlice } from "@reduxjs/toolkit";
import { getSelectedSources } from "../thunk/thunk";

const sourceSlices = createSlice({
  name: "categoriesPosts",
  initialState: {
    data: [],
    selectedData: [],
    loading: false,
    isSuccess: false,
    message: "",
  },
  reducers: {
    updateSourceSlices: (state: any, { payload }: any) => {
      // console.log("---payload---", payload);
      state.data = payload;
    },
    selectedSourceSlices: (state: any, { payload }: any) => {
      console.log("---payload---", payload);
      state.selectedData = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSelectedSources.pending, (state: any, action: any) => {
      state.loading = true;
    });
    builder.addCase(
      getSelectedSources.fulfilled,
      (state: any, { payload }: any) => {
        // console.log("---payload---", payload);
        state.loading = false;
        state.selectedData = payload;
        state.isSuccess = true;
      }
    );
    builder.addCase(
      getSelectedSources.rejected,
      (state: any, { payload }: any) => {
        state.loading = false;
        state.isSuccess = false;
        state.message = "failed";
        // state.selectedData = payload;
      }
    );
  },
});
export const { updateSourceSlices } = sourceSlices.actions;
export const { selectedSourceSlices } = sourceSlices.actions;

export default sourceSlices;

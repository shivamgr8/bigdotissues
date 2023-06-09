import { createSlice } from "@reduxjs/toolkit";
import { getRecentCategory } from "../thunk/thunk";

const recentCategorySlice = createSlice({
  name: "recentCategory",
  initialState: {
    recentCategoryData: [],
    loading: false,
    isSuccess: false,
    message: "",
  },

  reducers: {
    updateRecentCategory: (
      state: { recentCategoryData: any },
      { payload }: any
    ) => {
      state.recentCategoryData = payload;
    },
  },

  //   extraReducers: (builder) => {
  //     builder.addCase(getRecentCategory.pending, (state: any, action) => {
  //       state.loading = true;
  //     });
  //     builder.addCase(
  //       getRecentCategory.fulfilled,
  //       (state: any, { payload }: any) => {
  //         state.loading = false;
  //         state.selectedData = payload;
  //         state.isSuccess = true;
  //       }
  //     );
  //     builder.addCase(
  //       getRecentCategory.rejected,
  //       (state: any, { payload }: any) => {
  //         state.loading = false;
  //         state.isSuccess = false;
  //         state.message = "failed";
  //       }
  //     );
  //   },
});

export const { updateRecentCategory } = recentCategorySlice.actions;
export default recentCategorySlice;

import { createSlice } from "@reduxjs/toolkit";

const bookMarksPosts = createSlice({
  name: "bookMarksPosts",
  initialState: {
    data: [],
    loading: false,
    isSuccess: false,
    message: "",
  },

  reducers: {
    updateBookMarkPosts: (
      state: { data: any },
      action: { payload: { payload: any; isConcat: boolean } }
    ) => {
      const { payload } = action;
      console.log("---isConcat---", payload);
      if (payload.isConcat === true) {
        if (state.data && state.data.length >= 30) {
          state.data.pop();
          const filterData = payload.payload.filter(
            (item: any) => item?.is_bookmark === true
          );
          if (filterData && filterData.length) {
            state.data = [...filterData, ...state.data];
          } else {
            const filterData = state.data.filter((item: any) => {
              const matchingItem = payload.payload.filter(
                (secondItem: any) => secondItem?.id === item.id
              );
              return matchingItem.length === 0;
            });
            state.data = filterData;
          }
          return;
        } else {
          if (payload.payload && payload.payload.length) {
            const filterData = payload.payload.filter(
              (item: any) => item.is_bookmark === true
            );
            if (filterData && filterData.length) {
              state.data = [...filterData, ...state.data];
            } else {
              const filterData = state.data.filter((item: any) => {
                const matchingItem = payload.payload.filter(
                  (secondItem: any) => secondItem.id === item.id
                );
                return matchingItem.length === 0;
              });
              state.data = filterData;
            }
            console.log(
              state.data,
              "==================================--================================state============================--========================",
              payload.payload
            );
            console.log(
              state.data.length,
              "==================================--================================stateLength============================--========================",
              payload.payload.length
            );
            return;
          }
          state.data = payload.payload;
        }
      } else {
        state.data = payload.payload;
      }
    },
  },
});

export const { updateBookMarkPosts } = bookMarksPosts.actions;
export default bookMarksPosts;

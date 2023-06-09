import { createSlice } from "@reduxjs/toolkit";

const historyPosts = createSlice({
  name: "historyPosts",
  initialState: {
    data: [],
  },
  reducers: {
    updateHistoryPosts: (
      state: { data: any },
      action: { payload: { payload: any; isConcat: boolean } }
    ) => {
      const { payload } = action;
      console.log("--payload--", payload.payload.length);
      if (payload.isConcat === true) {
        if (state.data && state.data.length >= 30) {
          let historyData = [...state.data];
          historyData.pop();
          const filterData = historyData.filter(
            (item) => item.id !== payload.payload[0].id
          );
          state.data = [...payload.payload, ...filterData];
          return;
        } else {
          if (payload.payload && payload.payload.length) {
            let historyData = [...state.data];
            const filterData = historyData.filter(
              (item) => item.id !== payload.payload[0].id
            );
            state.data = [...payload.payload, ...filterData];
            return;
          }
        }
      } else {
        state.data = payload.payload;
        return;
      }
    },
  },
});

export const { updateHistoryPosts } = historyPosts.actions;
export default historyPosts;

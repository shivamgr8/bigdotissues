import { configureStore } from "@reduxjs/toolkit";
import sourceSlices from "../slices/sourcesSlices";
import storeSlice from "../slices/storeSlice";
import recentCategorySlice from "../slices/recentCategorySlice";
import bookMarksPosts from "../slices/bookmarksPosts";
import audioSlice from "../slices/AudioSlice";
import historyPosts from "../slices/historyPosts";

export const store = configureStore({
  reducer: {
    storeSlice: storeSlice,
    sourceSlice: sourceSlices.reducer,
    recentCategorySlice: recentCategorySlice.reducer,
    bookMarkPosts: bookMarksPosts.reducer,
    historyPosts: historyPosts.reducer,
    audioSlice: audioSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

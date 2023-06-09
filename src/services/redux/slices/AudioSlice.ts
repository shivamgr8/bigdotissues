import { createSlice } from "@reduxjs/toolkit";
import { AppConsolelog } from "../../../utils/commonFunctions";

const audioSlice = createSlice({
  name: "audioSlice",
  initialState: {
    data: { playbackObj: null, soundObj: null },
  },
  reducers: {
    updateAudioSlice: (state: { data: any }, { payload }) => {
      state.data = payload;
    },
    stopAudio: (state: { data: any }) => {
      if (state.data?.soundObj) {
        state.data.playbackObj.stopAsync();
        return {
          ...state,
          data: {
            playbackObj: null,
            soundObj: null,
          },
        };
      }
      return state;
    },
  },
});

export const { updateAudioSlice } = audioSlice.actions;
export const { stopAudio } = audioSlice.actions;
export default audioSlice;

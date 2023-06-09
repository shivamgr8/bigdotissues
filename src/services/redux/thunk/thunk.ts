import { createAsyncThunk } from "@reduxjs/toolkit";
import { api_GetSourcePreferences } from "../../network/apiServices";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getSelectedSources: any = createAsyncThunk(
  "getSources",
  async (uid: string, { getState, rejectWithValue }) => {
    try {
      if (uid && uid.length !== 0) {
        const data = await api_GetSourcePreferences(uid);
        if (
          (data && data.data && data.data?.checked !== "all") ||
          (data && data.data && !data?.data?.checked)
        ) {
          return JSON.parse(data.data.checked);
        }
      } else {
        const data: any = await AsyncStorage.getItem("bigdot_sources");
        if (data != null || data != undefined) {
          let json_arr = JSON.parse(JSON.parse(data));
          return json_arr;
        }
      }
    } catch (error) {
      console.log("--errro---", error);
    }
  }
);

export const getRecentCategory: any = createAsyncThunk(
  "getRecentCategory",
  async () => {
    try {
    } catch (error) {}
  }
);

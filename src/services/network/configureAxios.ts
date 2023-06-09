import axios, { AxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";
import { CONSTANTS } from "../../constants/Constants";
import emitter from "../../hooks/emitter";

/** -------------------Initiate axios instance --------------------------- **/

const configureAxios = () => {
  let token = "";
  return axios.create({
    timeout: 8000,
    // withCredentials: false,
    baseURL: CONSTANTS.API_HOST, //<YOUR_BASE_URL>
    headers: {
      "Content-Encoding": "gzip",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const axiosInstance = configureAxios();

/** -------------------Axios request Intercepertor--------------------------- **/

axiosInstance.interceptors.request.use(
  async (config) => {
    // console.log('request config==>', config);
    // config.headers.Authorization = `Bearer <ACCESS TOKEN>`;
    if (config.method == "post" || config.method == "get") {
      if (config.headers) {
        config.headers["Content-Type"] = "multipart/form-data";
        try {
          let res: any = await SecureStore.getItemAsync("bigdot_ptoken");
          if (res != null) {
            let token_json = JSON.parse(res);
            config.headers.Authorization = `Bearer ${token_json.ptoken}`;
            //console.log(JSON.stringify(config.headers))
          }
          //console.info('SecureStore:'+res)
        } catch (e) {
          console.log(e);
        }
      }
    }
    return await config;
  },
  (error) => {
    console.log(`Axios error on request on url ${error}`);
    return Promise.reject(error);
  }
);

/** -------------------Axios response Intercepertor--------------------------- **/

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data.type === "invalid_token") {
      emitter.emit("refresh_categories", "refreshApp");
    }
    return response.data;
  },
  (error) => {
    if (error.response.status === 408 || error.code === "ECONNABORTED") {
      console.log(`A timeout happend on url ${error}`);
    } else {
      console.log(error);
    }
    return Promise.reject(error);
  }
);

import React, { useEffect, useState, useReducer, useContext } from "react";
import { axiosInstance } from "./configureAxios";
import { CONSTANTS } from "../../constants/Constants";
import { AuthContext } from "../../hooks/AuthContext";
import { AxiosError } from "axios";
import SingleFooterAudioPlayer from "../../components/staticComponents/SingleFooter_backup_audio_player";
import { authUserType, sourceType } from "../../../types";
import {
  AppConsolelog,
  ValidateEmail,
  apiAuthFieldValue,
} from "../../utils/commonFunctions";
import { Platform } from "react-native";

/**
 * @description Fetches all post categories
 * @returns
 */
export const api_getCategories = async () => {
  try {
    console.info("API Path for api_getCategories");
    const response: any = await axiosInstance.get("sync/categories");
    const json = response;
    return json;
  } catch (error: any) {
    console.log("API URL:" + error.config.url + error);
    return false;
  }
};

/**
 * @description save user recent category on cloud
 * @param userId
 * @param categoryId
 * @returns
 */
export const apiSaveRecentCategories = async (
  userId: string,
  categoryId: string
) => {
  try {
    const params = { userId, categoryId };
    AppConsolelog("--apiSaveRecentCategoriesParams--", params);
    const response: any = await axiosInstance.post(
      "api/user/save_recent_categories",
      params
    );
    return response;
  } catch (error: any) {
    AppConsolelog("API URL:" + error.config.url + error);
    return false;
  }
};

/**
 * @description get user recent category from cloud
 * @param userId
 * @returns
 */
export const apiGetRecentCategories = async (userId: string) => {
  try {
    const params = { userId };
    AppConsolelog("--apiGetRecentCategoriesParams--", params);
    const response: any = await axiosInstance.post(
      "api/user/get_recent_categories",
      params
    );
    return response;
  } catch (error: any) {
    AppConsolelog("API URL:" + error.config.url + error);
    return false;
  }
};

/**
 * @description save user category
 * @returns
 */
export const apiSaveUserCategory = async (
  userId: string,
  categories: string,
  is_custom_order?: string
) => {
  try {
    const params = is_custom_order
      ? { userId, categories, is_custom_order }
      : { userId, categories };
    console.log("--apiSaveUserCategoryParams--", params);
    const response = await axiosInstance.post(
      "api/user/save_category_preference",
      params
    );
    return response;
  } catch (error) {
    AppConsolelog("--errorWhileSaveUserCategory--", error);
  }
};

/**
 * @description get user category
 * @returns
 */
export const apiGetUserCategory = async (userId: string) => {
  try {
    const params = { userId };
    const response = await axiosInstance.post(
      "api/user/get_category_preference",
      params
    );
    return response;
  } catch (error) {
    AppConsolelog("--errorWhileSaveUserCategory--", error);
  }
};

/**
 * @description Function fetches post based on post id
 * @param postId
 * @returns
 */
export const api_getPost = async (postId: number) => {
  let post_params = { postId: postId };
  try {
    console.info("API Path for api_getPost");
    const response: any = await axiosInstance.get(`sync/post?postId=${postId}`);
    const json = response;
    return json;
  } catch (error: any) {
    console.log("API URL:" + error.config.url + error);
    return false;
  }
};
/**
 * @description Fetches Posts based on category from API service.
 * @param cate_id
 * @param current_page
 * @param tsignal
 * @returns
 */
export const api_getCategoryPosts = async (
  cate_id: number,
  current_page: number,
  tsignal?: AbortSignal
) => {
  try {
    //cate_id should be 0 to get posts from all categories
    const api_path =
      cate_id != 0
        ? "sync/posts?catid=" + cate_id + "&page=" + current_page
        : "sync/posts?page=" + current_page;
    console.info("API Path for api_getCategoryPosts : " + api_path);
    const response: any = await axiosInstance.get(api_path, {
      signal: tsignal,
    });
    const json = response;
    return json;
  } catch (error: any) {
    console.log("API URL:" + error.config.url + error);
    return false;
  }
};
/**
 * @description Fetches Posts based on seacrch text from API service.
 * @param srch_txt
 * @param current_page
 * @param tsignal
 * @returns
 */
export const api_getSearchPosts = async (
  srch_txt: string,
  current_page: number,
  tsignal?: AbortSignal
) => {
  try {
    let post_params = { search_text: srch_txt };

    //const api_path = (srch_txt!='')? 'search/post?catid='+srch_txt+'&page='+current_page:'sync/posts?page='+current_page
    //console.info('API Path for api_getSearchPosts : '+api_path)
    //const response:any = await axiosInstance.get(api_path, {signal:tsignal});
    const response: any = await axiosInstance.post(
      "api/search/post",
      post_params
    );
    const json = response;
    return json;
  } catch (error: any) {
    console.log("API URL: " + error.config.url + error);
    return false;
  }
};
/**
 * @description Function updates bookmarks based on action 'save'|'remove'
 * @param postId
 * @param action
 */
export const api_updateBookmarkOnline = async (
  userId: string,
  postId: string,
  action: string
) => {
  let post_params = { userId, postId };
  console.log("--authUserId----", post_params);
  try {
    const response: any = await axiosInstance.post(
      "api/bookmark/" + action,
      post_params
    );
    console.info("Response for api/bookmark: " + JSON.stringify(response));
    console.log("--res--", response);
    return response;
  } catch (error) {
    console.log(error);
  }
};
//already generated
// export const api_getBookmarkOnline = async (
//   authUser: authUserType | false,
//   pageNo: any,
//   action: string
// ) => {
//   if (authUser) {
//     let post_params_page = { userId: authUser.uid, page: pageNo };
//     let post_params = { userId: authUser.uid };
//     console.log("--authUserId----", post_params);
//     try {
//       if (pageNo === null) {
//         const response: any = await axiosInstance.post(
//           "api/bookmark/" + action,
//           post_params
//         );
//         return response;
//       } else {
//         const response: any = await axiosInstance.post(
//           "api/bookmark/" + action,
//           post_params_page
//         );
//         console.info("Response for api/bookmark: " + JSON.stringify(response));
//         return response;
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }
// };
// end

/**
 * @description Function updates history based on action 'save'|'remove'
 * @param postId
 * @param action
 */
export const api_updateHistoryOnline = async (
  authUser: authUserType | false,
  postId: string,
  action: string
) => {
  if (authUser) {
    let params = { userId: authUser.uid, postId: postId };
    console.log("---postId--", postId);
    try {
      const response: any = await axiosInstance.post(
        "api/history/" + action,
        params
      );
      console.info("Response for api/history: " + JSON.stringify(response));
      return response;
    } catch (error) {
      console.log(error);
    }
  }
};
export const api_getSources = async () => {
  try {
    const api_path = "sync/sources";
    console.info("API Path for api_getSources : " + api_path);
    const response: any = await axiosInstance.get(api_path);
    return response;
  } catch (error: any) {
    console.log("API URL:" + error.config.url + error);
    return false;
  }
};
/**
 * @description Fetches Source Posts based on source ID from API service.
 * @param source_id
 * @param current_page
 * @returns
 */
export const api_getSourcePosts = async (
  source_id: number,
  current_page: number
) => {
  try {
    const api_path =
      "sync/posts?sourceId=" + source_id + "&page=" + current_page;
    console.info("API Path for api_getSourcePosts : " + api_path);
    const response: any = await axiosInstance.get(api_path);
    const json = response;
    return json;
  } catch (error: any) {
    console.log("API URL:" + error.config.url + error);
    return false;
  }
};
/**
 * @description Fetches Time Digest Posts from API service.
 * @param cate_id
 * @param current_page
 * @param tsignal
 * @returns
 */
export const api_getTimeDigestPosts = async (
  cate_id: string | number,
  current_page: number
) => {
  try {
    const api_path =
      cate_id != 0
        ? "sync/posts?catid=" + cate_id + "&page=" + current_page
        : "sync/posts?page=" + current_page;
    console.info("API Path for api_getTimeDigestPosts : " + api_path);
    const response: any = await axiosInstance.get(api_path);
    const json = response;
    return json;
  } catch (error: any) {
    console.log("API URL:" + error.config.url + error);
    return false;
  }
};

/**
 * @description get digest data
 * @param page
 * @returns
 */
export const getDigestData = async (page: number) => {
  console.log("--apiPage--", page);
  try {
    const result = await axiosInstance.get(`sync/digest?page=${page}`);
    return result;
  } catch (error) {
    AppConsolelog("--errorWhileGetDigestData--", error);
    return false;
  }
};

/**
 * @description Function to provide feed for 'bookmark'|'history' for logged in user
 * @param type 'bookmark'|'history'
 * @param uid
 * @param current_page
 * @returns
 */
export const api_MyDigestFeed = async (
  type: string,
  uid: string,
  current_page: number
) => {
  try {
    const params = { userId: uid, page: current_page };
    const api_path = "api/" + type + "/feed";
    console.info(
      "API Path for api_MyDigestFeed : " +
        api_path +
        " " +
        JSON.stringify(params)
    );
    const response: any = await axiosInstance.post(api_path, params);
    const json = response;
    return json;
  } catch (error: any) {
    console.log("API URL:" + error.config.url + error);
    return false;
  }
};
//-------------Auth Endpoints
export const api_LoginCheck = async (
  t_email: string,
  force_otp?: boolean,
  countryCode?: string
) => {
  try {
    let auth_type = "email";
    if (ValidateEmail(t_email) === false) {
      auth_type = "mobile";
    }
    const params =
      force_otp && countryCode
        ? { [auth_type]: t_email, force_otp: 1, countryCode }
        : force_otp && !countryCode
        ? { [auth_type]: t_email, force_otp: 1 }
        : countryCode
        ? { [auth_type]: t_email, countryCode }
        : { [auth_type]: t_email };
    const api_path = "api/user/login";
    console.log("---api_LoginCheckParams---", params);
    console.info("API Path for api_LoginCheck : " + api_path);
    const response: any = await axiosInstance.post(api_path, params);
    const json = response;
    return json;
  } catch (error: any) {
    console.log("API URL:" + error.config.url + error);
    return false;
  }
};

export const api_logout = async (token: any) => {
  try {
    const params = { token: token };
    AppConsolelog("--api_logoutParams--", params);
    const response = await axiosInstance.post("api/user/logout", params);
    return response;
  } catch (error: any) {
    AppConsolelog("--error--", error);
  }
};

export const api_CreateAccount = async (
  t_email: string,
  t_pwd_otp?: string,
  countryCode?: string
) => {
  try {
    let auth_type = "email";
    if (ValidateEmail(t_email) === false) {
      auth_type = "mobile";
    }
    let params = countryCode
      ? { [auth_type]: t_email, otpcode: t_pwd_otp, countryCode }
      : { [auth_type]: t_email, otpcode: t_pwd_otp };
    const api_path = "api/user/create";
    console.log("--api_CreateAccountParams--", params);
    console.info("API Path for api_CreateAccount : " + api_path);
    const response: any = await axiosInstance.post(api_path, params);
    const json = response;
    return json;
  } catch (error: any) {
    console.log("API URL:" + error.config.url + error);
    return false;
  }
};
export const api_LoginAuth = async (
  userId: string,
  value?: string | any,
  field?: string | any,
  countryCode?: string | any,
  twSecret?: string | any
) => {
  try {
    // let auth_type = "email";
    // if (ValidateEmail(userId) === false) {
    //   auth_type = "mobile";
    // }
    console.log("--field--", field);
    const params = apiAuthFieldValue(
      userId,
      value,
      field,
      countryCode,
      twSecret
    );
    console.log("--api_LoginAuthParams--", params);
    // field === "password"
    //   ? { [auth_type]: userId, password: value }
    //   : { [auth_type]: userId, otpcode: value };
    const api_path = "api/user/login_auth";
    console.info("API Path for api_LoginAuth : " + api_path);
    const response: any = await axiosInstance.post(api_path, params);
    const json = response;
    console.info(json);
    return json;
  } catch (error: any) {
    console.log("API URL:" + error.config.url + error);
    return false;
  }
};
export const api_UpdateProfile = async (
  uid: string,
  fname: string,
  lname: string,
  pwd: string,
  gender: string,
  dob: string,
  country?: string
) => {
  try {
    const params =
      pwd === ""
        ? {
            userId: uid,
            firstName: fname,
            lastName: lname,
            gender: gender,
            dob: dob,
            country,
          }
        : {
            userId: uid,
            firstName: fname,
            lastName: lname,
            password: pwd,
            gender: gender,
            dob: dob,
          };
    const api_path = "api/user/update_profile";
    console.info(
      "API Path for api_UpdateProfile : " +
        api_path +
        " params: " +
        JSON.stringify(params)
    );
    const response: any = await axiosInstance.post(api_path, params);
    const json = response;
    //console.log(json)
    return json;
  } catch (error: any) {
    console.log("API URL:" + error.config.url + error);
    return false;
  }
};

export const api_SaveSourcePreferences = async (
  uid: string,
  source_id_arr: string[]
) => {
  try {
    /*let s_arr:any = []
          source_id_arr.forEach(t_item => {
               if(t_item.status){
                    s_arr.push(t_item.id)
               }
          });*/
    if (source_id_arr.length > 4) {
      const params = { userId: uid, sources: source_id_arr.join(",") };
      const api_path = "api/user/save_source_preference";
      // console.log("---paramsaources---", params.sources);
      console.info(
        "API Path for api_SaveSourcePreferences : " +
          api_path +
          " " +
          JSON.stringify(params)
      );
      const response: any = await axiosInstance.post(api_path, params);
      const json = response;
      return json;
    } else {
      return false;
    }
  } catch (error: any) {
    console.log("API URL:" + error.config.url + error);
    return false;
  }
};
export const api_update_source_preference = async (
  uid: string,
  source_id: string,
  is_active: boolean
) => {
  try {
    /*let s_arr:any = []
          source_id_arr.forEach(t_item => {
               if(t_item.status){
                    s_arr.push(t_item.id)
               }
          });*/
    const params = { userId: uid, sources: source_id, is_active: is_active };
    const api_path = "api/user/update_source_preference";
    console.info(
      "API Path for api_update_source_preference : " +
        api_path +
        " " +
        JSON.stringify(params)
    );
    const response: any = await axiosInstance.post(api_path, params);
    const json = response;
    return json;
  } catch (error: any) {
    console.log("API URL:" + error.config.url + error);
    return false;
  }
};
export const api_GetSourcePreferences = async (uid: string) => {
  try {
    const params = { userId: uid };
    const api_path = "api/user/get_source_preference";
    AppConsolelog(
      "API Path for api_GetSourcePreferences : " + api_path,
      "--api_GetSourcePreferencesParams--" + JSON.stringify(params)
    );
    const response: any = await axiosInstance.post(api_path, params);
    const json = response;
    return json;
  } catch (error: any) {
    console.log("API URL:" + error.config.url + error);
    return false;
  }
};

export const api_RemoveAllHistory = async (uid: string) => {
  let post_params = { userId: uid };
  try {
    const response: any = await axiosInstance.post(
      "api/history/delete_all",
      post_params
    );
    console.info(
      "Response for api_RemoveAllHistory: " + JSON.stringify(response)
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
export const api_RemoveAllBookmarks = async (uid: string) => {
  let post_params = { userId: uid };
  try {
    const response: any = await axiosInstance.post(
      "api/bookmark/delete_all",
      post_params
    );
    console.info(
      "Response for api_RemoveAllBookmarks: " + JSON.stringify(response)
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const api_UploadAvatar = async (uid: string, fileToUpload: any) => {
  // type uploadResponseType={
  //      status:'success'|"error"
  // }
  //let post_params={'userId':uid, "fileToUpload":fileToUpload}
  fileToUpload = {
    ...fileToUpload,
    uri:
      Platform.OS === "android"
        ? fileToUpload.path
        : fileToUpload.path.replace("file://", ""),
    name: uid + "_" + new Date().getTime() + ".jpg",
    type: "image/jpeg", // it may be necessary in Android.
  };
  const formData = new FormData();
  formData.append("userId", uid);
  formData.append("fileToUpload", fileToUpload);

  console.log("--fileToUpload--", fileToUpload.cropRect);

  try {
    const response: any = await axiosInstance.post(
      // "bigdotuploads/bigdotupload.php",
      "api/user/update_profile_image",
      formData
    );
    //console.info('Response for api_UploadAvatar: '+ JSON.stringify(response))
    return response;
  } catch (error) {
    console.log(error);
    return error;
    //return {status:"error"}
  }
};

export const api_breaking_news = async () => {
  try {
    const response: any = await axiosInstance.get("sync/breaking_news");
    //     console.log("---resofbreakingnews-----", response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const api_more_for_you = async (postId: number) => {
  try {
    const response: any = await axiosInstance.get(
      `sync/more_for_you?postId=${postId}`
    );
    //     console.log("---resofbreakingnews-----", response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const saveCategoryNotifications = async (
  userId: string,
  cateId: any
) => {
  console.log("--cateId---", cateId);
  try {
    const params = { userId: userId, categories: cateId };
    const response = await axiosInstance.post(
      "api/user/save_user_notifications",
      params
    );
    // console.log("---response----", response);
    return response;
  } catch (error) {}
};

export const getCategoryNotification = async (userId: string) => {
  try {
    const params = { userId: userId };
    const response = await axiosInstance.post(
      "api/user/get_user_notifications",
      params
    );
    console.log("---res---", response);
    return response;
  } catch (error) {}
};

/**
 * @description get Local history
 * @param postId
 * @returns
 */
export const getLocalHistory = async (postId: string) => {
  try {
    const params = { post_arr: JSON.stringify(postId) };
    AppConsolelog("---getLocalHistoryParams--", params);
    const response = await axiosInstance.post("sync/post_arr", params);
    // console.log("---resHistory---", response);
    return response;
  } catch (error) {
    AppConsolelog("--errorWhileGetLocalHistory--", error);
  }
};

/**
 * @description remove single history
 * @param postId
 * @param userId
 * @returns
 */
export const removeSingleHistoryBookMark = async (
  userId: string,
  postId: string,
  type: string
) => {
  try {
    const params = { userId, postId };
    const response = await axiosInstance.post(`api/${type}/delete`, params);
    return response;
  } catch (error) {
    AppConsolelog("--errorWhileRemovingSingleHistory--", error);
  }
};

/**
 * @description set password and change password
 * @param old_password
 * @param password
 * @returns
 */
export const updatePassword = async (
  password: string,
  old_password?: string
) => {
  try {
    const params = old_password ? { password, old_password } : { password };
    console.log("--updatePasswordParams--", params);
    const response = await axiosInstance.post("api/user/set_password", params);
    return response;
  } catch (error) {
    console.log("--error--", error);
  }
};

/**
 * @description forgot password
 * @param email
 * @param mobile
 * @param countryCode
 * @returns
 */
export const forgotPassword = async (userId: string, countryCode?: string) => {
  try {
    const params = countryCode
      ? { mobile: userId, countryCode }
      : { email: userId };
    console.log("--forgotPasswordParams--", params);
    const response = await axiosInstance.post(
      "api/user/forgot_password",
      params
    );
    return response;
  } catch (error) {
    console.log("--error--", error);
  }
};

/**
 * @description forgot password otp code
 * @param email
 * @param mobile
 * @param countryCode
 * @returns
 */
export const forgotPasswordOtpValidate = async (
  userId: string,
  otpcode: string,
  countryCode?: string
) => {
  try {
    const params = countryCode
      ? { mobile: userId, countryCode, otpcode }
      : { email: userId, otpcode };
    console.log("--forgotPasswordOtpValidateParams--", params);
    const response = await axiosInstance.post(
      "api/user/forgot_password_otp_validate",
      params
    );
    return response;
  } catch (error) {
    console.log("--error--", error);
  }
};

/**
 * @description reset password otp code
 * @param email
 * @param mobile
 * @param countryCode
 * @returns
 */
export const resetPassword = async (
  userId: string,
  otpcode: string,
  password: string,
  countryCode?: string
) => {
  try {
    const params = countryCode
      ? { mobile: userId, countryCode, otpcode, password }
      : { email: userId, otpcode, password };
    console.log("--resetPasswordParams--", params);
    const response = await axiosInstance.post(
      "api/user/reset_password",
      params
    );
    return response;
  } catch (error) {
    console.log("--error--", error);
  }
};

/**
 * @description getAudio
 * @param postId
 * @returns
 */
export const getPostAudio = async (postId: string) => {
  try {
    const params = { postId };
    console.log("--getPostAudioParams--", params);
    const response = await axiosInstance.post("api/get/audio", params);
    return response;
  } catch (error) {
    console.log("--error--", error);
  }
};

/**
 * @description updateEmail
 * @param userId
 * @param email
 * @returns
 */
export const updateEmail = async (userId: string, email: string) => {
  try {
    const params = { userId, email };
    console.log("--updateEmailParams--", params);
    const response = await axiosInstance.post("api/user/update_email", params);
    return response;
  } catch (error) {
    console.log("--error--", error);
  }
};

/**
 * @description update Mobile
 * @param userId
 * @param mobile
 * @param countryCode
 * @returns
 */
export const updateMobile = async (
  userId: string,
  mobile: string,
  countryCode: string
) => {
  try {
    const params = { userId, mobile, countryCode };
    console.log("--updateMobileParams--", params);
    const response = await axiosInstance.post("api/user/update_mobile", params);
    return response;
  } catch (error) {
    console.log("--error--", error);
  }
};

/**
 * @description updateMobileAndEmailValidateOtp
 * @param userId
 * @param otpcode
 * @returns
 */
export const updateMobileAndEmailValidateOtp = async (
  userId: string,
  value: string,
  otpcode: string,
  countryCode: string,
  type: string
) => {
  try {
    let valueKey = value.includes("@") ? "email" : "mobile";
    const params = countryCode
      ? { userId, [valueKey]: value, otpcode, countryCode }
      : { userId, [valueKey]: value, otpcode, countryCode };
    console.log(type, "--updateMobileParams--", params);
    const response = await axiosInstance.post(`api/user/${type}`, params);
    return response;
  } catch (error) {
    console.log("--error--", error);
  }
};

/**
 * @description remove image
 * @param userId
 * @returns
 */

export const removeUserPic = async (userId: string) => {
  const params = { userId };
  const response = await axiosInstance.post(
    "api/user/remove_profile_image",
    params
  );
  return response;
};

export const getCountryList = async () => {
  const response = await axiosInstance.get(
    "https://mocki.io/v1/361bb738-f9ee-4959-9b27-1a97775a322e"
  );
  return response;
};

import React from "react";
import { Share } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeAsyncData } from "../hooks/asyncStorage";
import * as SecureStore from "expo-secure-store";
import { NavigationProp } from "@react-navigation/native";
import {
  apiGetUserCategory,
  api_getCategories,
  api_getCategoryPosts,
  api_logout,
  api_updateBookmarkOnline,
} from "../services/network/apiServices";
import { authUserType, catObjType, itemType } from "../../types";
import emitter from "../hooks/emitter";
import { AppConsolelog } from "./commonFunctions";

//----- start: bookmark actions --------
interface PostsCardProps {
  item: itemType;
}

export const getSecureToken = async () => {
  let result = await SecureStore.getItemAsync("bigdot_ptoken");
  if (result) {
    return result;
  } else {
    return false;
  }
};

export const getLogin = async () => {
  try {
    const value: any = await AsyncStorage.getItem("bigdot_login");
    console.info("getLogin: " + value);
    if (value !== null && value != undefined) {
      return JSON.parse(value);
    } else {
      return false;
    }
  } catch (e: any) {
    console.log("Error in Func getLogin" + e.message);
  }
};
export const getUserDetails = async () => {
  try {
    const value: any = await AsyncStorage.getItem("bigdot_userdetails");
    console.info("getUserDetails: " + value);
    if (value !== null && value != undefined) {
      return JSON.parse(value);
    } else {
      return [];
    }
  } catch (e: any) {
    console.log("Error in Func getUserDetails" + e.message);
  }
};

export const saveRecentCategories = (route_params: any) => {
  try {
    let tobj = JSON.parse(JSON.stringify(route_params));
    tobj.slug = tobj?.Title.toLowerCase()
      .replace(/ /g, "")
      .replace(/[^\w-]+/g, "");
    tobj.count = "1";
    AsyncStorage.getItem("bigdot_recent_categories").then(
      (recent_resp: any) => {
        if (recent_resp != null || recent_resp != undefined) {
          let recent_arr = JSON.parse(JSON.parse(recent_resp));
          // recent_arr = recent_arr.slice(0, 3); // limit to keep only 4 recent (we have kept 3 as we add one recent here)
          if (recent_arr && recent_arr.length >= 5) {
            recent_arr = recent_arr.slice(1); // limit to keep only 4 recent (we have kept 3 as we add one recent here)
          }
          // else {
          //   recent_arr = recent_arr.slice(0, 3);
          // }
          let objectFound = findInObject(
            recent_arr,
            "CateId",
            route_params?.CateId
          );
          if (objectFound) {
            tobj.count = parseInt(objectFound[0].count) + 1;
          }
          //let updated_json = findInObjectUpdate(recent_arr, tobj , 'CateId',route_params?.CateId) //update if title changes
          let updated_json = findInObjectAndRemove(
            recent_arr,
            "CateId",
            route_params?.CateId
          );
          updated_json = updated_json.concat(tobj);
          storeAsyncData(JSON.stringify(updated_json), "recent_categories");
        } else {
          storeAsyncData(JSON.stringify([tobj]), "recent_categories");
        }
      }
    );
  } catch (error: any) {
    console.log(error.message);
  }
};

export const saveOnlineRecentCategories = (
  route_params: any,
  data: [] | any
) => {
  try {
    let tobj = JSON.parse(JSON.stringify(route_params));
    tobj.slug = tobj?.Title.toLowerCase()
      .replace(/ /g, "")
      .replace(/[^\w-]+/g, "");
    tobj.count = "1";
    if (data && data.length) {
      let recent_arr = data;
      if (recent_arr && recent_arr.length >= 5) {
        recent_arr = recent_arr.slice(1);
      }
      let objectFound = findInObject(
        recent_arr,
        "CateId",
        route_params?.CateId
      );
      if (objectFound) {
        tobj.count = parseInt(objectFound[0].count) + 1;
        return data;
      }
      let updated_json = findInObjectAndRemove(
        recent_arr,
        "CateId",
        route_params?.CateId
      );
      updated_json = updated_json.concat(tobj);
      return updated_json;
    }
    return [tobj];
  } catch (error: any) {
    console.log(error.message);
  }
};

export const getBookmarkPosts = async () => {
  try {
    const value: any = await AsyncStorage.getItem("bigdot_bookmarks");
    if (value !== null && value != undefined) {
      return JSON.parse(value);
    } else {
      return [];
    }
  } catch (e: any) {
    console.log("Error in Func getBookmarkPosts" + e.message);
  }
};
// export const setBookmarkPosts = async (
//   json_obj: itemType,
//   t_callback: any,
//   authUser: authUserType | false
// ) => {
//   try {
//     const bm_str = await getBookmarkPosts();
//     const bm = JSON.parse(bm_str);
//     console.info("Boomkarks total> : " + bm.length);

//     const isFound = findInObject(bm, "id", json_obj.id);

//     if (isFound) {
//       try {
//         api_updateBookmarkOnline(authUser, json_obj.id, "remove");
//       } catch (e: any) {
//         console.log("setBookmarkPosts - remove: " + e.message);
//       }

//       const new_json = findInObjectAndRemove(bm, "id", json_obj.id);
//       //console.info('New Json: '+JSON.stringify(new_json))
//       storeAsyncData(JSON.stringify(new_json), "bookmarks");
//       t_callback(false);
//     } else {
//       try {
//         api_updateBookmarkOnline(authUser, json_obj.id, "save");
//       } catch (e: any) {
//         console.log("setBookmarkPosts - save: " + e.message);
//       }

//       const bookmark_data = bm.concat(json_obj);
//       storeAsyncData(JSON.stringify(bookmark_data), "bookmarks");
//       t_callback(true);
//     }
//   } catch (e: any) {
//     console.log("Error in setBookmarkPosts: " + e.message);
//     return false;
//   }
// };

// export const setBookmarkPosts = async (
//   json_obj: itemType,
//   t_callback: any,
//   authUser: authUserType | false
// ) => {
//   try {
//     // if (json_obj.is_bookmark === true) {
//     // } else {
//     api_updateBookmarkOnline(authUser, json_obj.id, "save").then((res) => {
//       if (res && res.post_data && res.post_data.length === 0) {
//         api_updateBookmarkOnline(authUser, json_obj.id, "delete").then(
//           (res) => {
//             console.log("--resRemove---", res);
//             // emitter.emit("alert", "removedBookmark");
//             t_callback(false);
//           }
//         );
//       } else {
//         t_callback(true);
//         emitter.emit("alert", "saved");
//       }
//       console.log("--resSaved--", res);
//     });
//     // }
//   } catch (e: any) {
//     console.log("Error in setBookmarkPosts: " + e.message);
//     return false;
//   }
// };

export const isBookmarkExists = (post_id: string | number, t_callback: any) => {
  let pres = false;
  try {
    getBookmarkPosts().then(function (value) {
      const bm = JSON.parse(value);
      if (bm.length != 0) {
        pres = findInObject(bm, "id", post_id);
        t_callback(pres);
      } else {
        pres = false;
        t_callback(pres);
      }
    });
  } catch (e: any) {
    // error reading value
    console.error(e.message);
    //return pres
  }
};
//----- end: bookmark actions --------

//-------start: find navigation path of a screen
export const findNavigationPath = (
  nav: NavigationProp<ReactNavigation.RootParamList>
) => {
  console.log("-----------start: Navigation Tree-----------");
  console.log(nav.getState().routeNames);
  let prnt = nav.getParent();
  while (prnt) {
    console.log(prnt?.getState().routeNames);
    prnt = prnt.getParent();
  }
  console.log("-----------end: Navigation Tree-----------");
};

//-------start: check server connection
export const isReachable = async () => {
  const timeout = new Promise((resolve, reject) => {
    setTimeout(reject, 10000, "Request timed out");
  });
  const request = fetch("https://bigdot.news");
  try {
    const response = await Promise.race([timeout, request]);
    return true;
  } catch (error: any) {
    return false;
    //console.error(error)
    //return alert('We are having some issue in connecting to server. Please check your internet connection');
  }
};

//-----------------------start: share------------------------
export const onShare = async (title: string, postId: string) => {
  try {
    const result = await Share.share({
      title: title,
      message:
        title + "- Bigdot \n" + "https://bigdot.news/post/" + postId + "",
      url: "https://bigdot.news/post/" + postId,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error: any) {
    console.log(error.message);
  }
};
export const onShareHandler = async (item: any) => {};
//-----------------------end: share------------------------

//-----------------------start: getCategories--------------
export const handleCategories = async () => {
  return new Promise((resolve, reject) => {
    try {
      api_getCategories().then((allCate) => {
        if (allCate && allCate.status === "success") {
          const items: [] = allCate.Items;
          getLogin().then((res) => {
            if (res && res.uid) {
              apiGetUserCategory(res.uid).then((res: any) => {
                AppConsolelog("--categoryRes--", res);
                if (
                  res &&
                  res.status === "success" &&
                  res.data &&
                  res.data.categories
                ) {
                  const data: [] | any = isJsonString(res.data.categories)
                    ? JSON.parse(res.data.categories)
                    : [];
                  if (data && data.length && res?.data.is_custom_order == "1") {
                    const filteredCategory = items
                      .filter((obj: any) => data.includes(parseInt(obj.id)))
                      .sort(
                        (a: any, b: any) =>
                          data.indexOf(parseInt(a.id)) -
                          data.indexOf(parseInt(b.id))
                      );
                    storeAsyncData(
                      JSON.stringify(filteredCategory),
                      "categories"
                    );
                    storeAsyncData(JSON.stringify(["1"]), "orderCategoryId");
                    resolve(true);
                  } else if (
                    data &&
                    data.length &&
                    res?.data.is_custom_order == "0"
                  ) {
                    const filteredCategory = items.filter((obj: any) =>
                      data.includes(parseInt(obj.id))
                    );
                    storeAsyncData(
                      JSON.stringify(filteredCategory),
                      "categories"
                    );
                    resolve(true);
                  } else {
                    storeAsyncData(JSON.stringify(items), "categories");
                    resolve(true);
                  }
                } else {
                  storeAsyncData(JSON.stringify(items), "categories");
                  resolve(true);
                }
              });
            } else {
              AsyncStorage.getItem("bigdot_orderCategoryId").then(
                (res: any) => {
                  if (res) {
                    const parseValue = JSON.parse(res);
                    if (parseValue && parseValue.length) {
                      const filteredCategory = items
                        .filter((obj: any) =>
                          parseValue.includes(parseInt(obj.id))
                        )
                        .sort(
                          (a: any, b: any) =>
                            parseValue.indexOf(parseInt(a.id)) -
                            parseValue.indexOf(parseInt(b.id))
                        );
                      storeAsyncData(
                        JSON.stringify(filteredCategory),
                        "categories"
                      );
                      return resolve(true);
                    }
                    storeAsyncData(JSON.stringify(items), "categories");
                    resolve(true);
                    return;
                  }
                  storeAsyncData(JSON.stringify(items), "categories");
                  resolve(true);
                }
              );
            }
          });
        }
      });
    } catch (error) {
      AppConsolelog("--errorInFilterCategory--", error);
      reject(error);
    }
  });
};
//-----------------------end: getCategories--------------

//--------------------start: getCategoriesPosts--------------
export const handleCategoriesPosts = async () => {
  return new Promise((resolve, reject) => {
    try {
      api_getCategoryPosts(0, 1).then((response) => {
        if (response && response.status === "success") {
          storeAsyncData(JSON.stringify(response), "category_posts");
          resolve(true);
          return;
        }
        reject(false);
      });
    } catch (error) {
      AppConsolelog("--errorWhileFetchingPosts---", error);
    }
  });
};
//--------------------end: getCategoriesPosts--------------

//------------------------end:HandleLogout-------------
export const handleSignOut = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let res: any = await SecureStore.getItemAsync("bigdot_ptoken");
      let parse = JSON.parse(res);
      if (parse && parse.ptoken) {
        api_logout(parse.ptoken).then(async (res: any) => {
          if (res && res.status === "success") {
            resolve(true);
          } else {
            emitter.emit("alert", "logoutError");
            reject(false);
          }
          AppConsolelog("--res--", res);
        });
      } else {
        emitter.emit("alert", "logoutError");
        reject(false);
      }
    } catch (error) {
      AppConsolelog("--errorWhileLogOut--", error);
      reject(false);
    }
  });
};
//------------------------end:HandleLogout-------------
//------------------ Utility Functions --------------
/**
 * @description Function accepts DateTime and returns hours difference from current DateTime
 * @param ptime
 * @returns Number
 */
export const getTimeDiff = (ptime: string) => {
  let ctime = new Date().getTime();
  let pdate = Date.parse(ptime.replace(" ", "T")); // only for react native
  const msInHour = 1000 * 60 * 60;

  return Math.round(Math.abs(ctime - pdate) / msInHour);
};
/**
 * @description Function checks if key value matches
 * @param json_obj JSON Object array
 * @param key JSON key
 * @param tval JSON value for the key
 * @returns Returns false if not found else will return matched object
 */
export const findInObject = (json_obj_arr: any, key: string, tval: any) => {
  let tres = json_obj_arr.filter(function (tobj: any) {
    return tobj[key] == tval && tobj;
  });
  return tres.length ? tres : false;
};
/**
 * @description Function finds and updates matching object in JSON Object Array
 * @param json_obj_arr
 * @param objToReplace
 * @param key
 * @param tval
 * @returns
 */
export const findInObjectUpdate = (
  json_obj_arr: any,
  objToReplace: any,
  key: string,
  tval: any
) => {
  const pindex = json_obj_arr.findIndex((tobj: any) => {
    return tobj[key] == tval;
  });
  if (pindex != -1) {
    json_obj_arr.splice(pindex, 1, objToReplace);
    return json_obj_arr;
  }
  return json_obj_arr;
};
/**
 * @description Function finds and removes matching object in JSON Object Array
 * @param json_obj JSON Object array
 * @param key JSON key
 * @param tval JSON value for the key
 * @returns Resturns the updated JSON after removing the matching key/value
 */
export const findInObjectAndRemove = (
  json_obj_arr: any,
  key: string,
  tval: any
) => {
  const pindex = json_obj_arr.findIndex((tobj: any) => {
    return tobj[key] == tval;
  });
  // console.log("----pindex--", pindex);
  if (pindex != -1) {
    json_obj_arr.splice(pindex, 1);
    // console.log("----json_obj_arr---", json_obj_arr);
    return json_obj_arr;
  }
  // console.log("----json_obj_arr2---", json_obj_arr);
  return json_obj_arr;
};
/**
 * @description Function check is string is a valid JSON
 * @param str
 * @returns
 */
export const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    console.log(e);
    return false;
  }
  return true;
};

function GetSortOrder(key: string, compare_as_number: boolean) {
  return function (a: any, b: any) {
    let a_val = compare_as_number ? parseInt(a[key]) : a[key];
    let b_val = compare_as_number ? parseInt(b[key]) : b[key];
    if (a_val > b_val) {
      return 1;
    } else if (a_val < b_val) {
      return -1;
    }
    return 0;
  };
}
/**
 * Function uses GetSortOrder for compare values and sort JSON arr based on item value for a key.
 * @param json_arr
 * @param key
 * @param compare_as_number
 */
export const sortJSON = (
  json_arr: any,
  key: string,
  compare_as_number: boolean = true
) => {
  return json_arr.sort(GetSortOrder(key, compare_as_number));
};

export const RearrangeCategories = (
  live_arr: catObjType[],
  cache_arr: catObjType[]
) => {
  let new_arr: catObjType[] = [];
  cache_arr.forEach((item, tindex) => {
    if (live_arr !== undefined) {
      let tres = live_arr.filter(function (tobj: catObjType, tindex: number) {
        return tobj["id"] == item.id;
      });
      if (tres.length == 0) {
        new_arr.push(tres[0]);
      }
    }
  });
  cache_arr = [...cache_arr, ...new_arr];
  return cache_arr;
};

export const onPlayAudio = async (
  playbackObj: { loadAsync: ({}) => void } | any,
  uri: string
) => {
  try {
    return await playbackObj?.loadAsync({ uri: uri }, { shouldPlay: true });
  } catch (error) {
    AppConsolelog("--errorWhilePlayingAudio--", error);
  }
};

export const pauseAudio = async (
  playbackObj: { setStatusAsync: ({}) => void } | any
) => {
  try {
    return await playbackObj?.setStatusAsync({
      shouldPlay: false,
    });
  } catch (error) {
    AppConsolelog("--errorWhilePausingingAudio--", error);
  }
};

export const resumeAudio = async (
  playbackObj: { playAsync: () => void } | any
) => {
  try {
    return await playbackObj?.playAsync();
  } catch (error) {
    AppConsolelog("--errorWhileResumingingAudio--", error);
  }
};

export const onToggleBookMark = (
  postId: string,
  index: number,
  postData: [{ is_bookmark: boolean }],
  uid: string
) => {
  AppConsolelog("--itemId--", postId);
  const data = [...postData];
  if (data[index].is_bookmark === true) {
    data[index].is_bookmark = false;
    api_updateBookmarkOnline(uid, postId, "delete")
      .then()
      .catch((error) => {
        AppConsolelog("--errorOnToggleBookMark--", error);
      });
  } else {
    data[index].is_bookmark = true;
    emitter.emit("alert", `${index},${postId},saved`);
    api_updateBookmarkOnline(uid, postId, "save")
      .then()
      .catch((error) => {
        AppConsolelog("--errorOnToggleBookMark--", error);
      });
  }
  return data;
};

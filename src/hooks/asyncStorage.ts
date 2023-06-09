import { useEffect, useState, useReducer } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import * as Application from "expo-application";
import { PrefetchContext, PrefetchContextProvider } from "./PrefetchContext";

export const asyncStorage = () => {
  const appid = Application.applicationId;
  const [prefetchData, setPF] = useState("");

  useEffect(() => {
    /*const getData = async () =>{
            try {
                const value = await AsyncStorage.getItem(appid+'key')
                if(value !== null) {                    
                    setPF(value)
                }
              } catch(e) {
                // error reading value
            }
        }*/

    return () => {
      //getData
    };
  }, []);
};

export const storeAsyncData = async (value: any, key: any) => {
  const appid = "bigdot_";
  const jsonValue = JSON.stringify(value);

  try {
    await AsyncStorage.setItem(appid + key, jsonValue);
    console.info("Data saved:text " + key);
  } catch (e: any) {
    // saving error
    console.log("Error saving data:" + key + "\n" + e.message);
  }
};

export const removeAsyncData = async (arr: string[], callBack: Function) => {
  //const keys = ['bigdot_categories', 'bigdot_category_posts']
  const keys = arr;
  console.info("Removing cache: " + JSON.stringify(keys));
  try {
    await AsyncStorage.multiRemove(keys);
    callBack(true);
  } catch (e) {
    console.log(e);
  }

  console.log("Async keys reset - Done");
};
//removeAsyncData(['bigdot_userdetails', 'bigdot_text_sizes', 'bigdot_firsttime', 'bigdot_sources', 'bigdot_categories', 'bigdot_recent_categories','bigdot_category_posts','bigdot_bookmarks','bigdot_search'])

export const storeSecureAsyncData = async (value: any, key: any) => {
  const appid = "bigdot_";
  const jsonValue = JSON.stringify(value);

  try {
    await SecureStore.setItemAsync(appid + key, jsonValue);
    console.info("Secure Data saved: " + key);
  } catch (e: any) {
    // saving error
    console.log("Error saving secure data:" + key + "\n" + e.message);
  }
};
export const removeSecureStore = async (key: string) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.log(error);
  }
};

import React, {
  createContext,
  useEffect,
  useState,
  useMemo,
  useContext,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  removeAsyncData,
  removeSecureStore,
  storeAsyncData,
  storeSecureAsyncData,
} from "../hooks/asyncStorage";
import * as Application from "expo-application";
import { authUserType } from "../../types";

import { FirebaseApp, initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import { app } from "../hooks/FirebaseAuth";
import {
  getLogin,
  handleCategories,
  handleSignOut,
} from "../utils/utilityFunctions";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { AppConsolelog } from "../utils/commonFunctions";
import emitter from "./emitter";
// import * as AuthSession from "expo-auth-session";

type AuthContextProvider = {
  children: React.ReactNode;
};

type AuthContextType = {
  isLoggedin: boolean;
  getUserData: authUserType | false;
  setUserData: any;
  signOut: any;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthContextProvider = ({ children }: AuthContextProvider) => {
  const [authUser, setAuthUser] = useState<authUserType | false>(false);
  let login_status = false;

  useEffect(() => {
    //console.info('Context updated: ' + AuthContextProvider.name)
    //console.info('Latest Auth: '+ JSON.stringify(authUser))
    //-- check AsyncStorage for login data

    return () => {};
  }, [authUser]);

  const setUserDataHandler = async (udata?: authUserType) => {
    try {
      let value: string | authUserType | null = null;
      let c_val: authUserType | null = null;
      //console.log('Auth Context setUserDataHandler: '+JSON.stringify(udata))
      if (!udata) {
        getLogin().then((tresp) => {
          c_val = tresp;
          console.info("session:" + JSON.stringify(tresp));
          f_setData(c_val);
        });
        //value = await AsyncStorage.getItem('bigdot_login')
        //if(value!==null && typeof(value)=='string') c_val = JSON.parse(value)
      } else {
        c_val = udata;
        f_setData(c_val);
      }
    } catch (e) {
      console.log("Error in AuthContext > setUserDataHandler.");
    }
  };

  const f_setData = (c_val: authUserType | null) => {
    //console.info('Auth c_val:'+ JSON.stringify(c_val))
    if (c_val) {
      //console.info('Setting AuthContext:'+ JSON.stringify(c_val))
      if (c_val.ptoken) {
        storeSecureAsyncData({ ptoken: c_val.ptoken }, "ptoken");
        delete c_val.ptoken;
      }
      storeAsyncData(c_val, "login");
      setAuthUser(c_val);
      login_status = true;
    } else {
      login_status = false;
      setAuthUser(false);
    }
  };

  const signOutHandler = async () => {
    return new Promise((resolve, reject) => {
      try {
        handleSignOut().then(async (res) => {
          if (res && res === true) {
            removeSecureStore("bigdot_ptoken");
            removeAsyncData(["bigdot_login"], async (response: any) => {
              console.log("--response---", response);
              if (response) {
                removeAsyncData(["bigdot_orderCategoryId"], (res: any) => {});
                removeAsyncData(["bigdot_userdetails"], (res: any) => {});
                login_status = false;
                setAuthUser(false);
                const firebaseAuth = getAuth(app);
                firebaseAuth.signOut();
                if (auth().currentUser) {
                  await GoogleSignin.signOut();
                  await auth().signOut();
                }
                emitter.emit("refresh_categories", "callApi");
                resolve(true);
              }
            });
          }
        });
      } catch (error) {
        reject(error);
        AppConsolelog("--lgError---", error);
      }
    });
  };

  const authMemo = useMemo((): AuthContextType => {
    return {
      isLoggedin: login_status,
      signOut: signOutHandler,
      getUserData: authUser,
      setUserData: setUserDataHandler,
    };
  }, [authUser]);

  return (
    <AuthContext.Provider value={authMemo}>{children}</AuthContext.Provider>
  );
};

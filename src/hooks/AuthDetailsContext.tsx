import React, { createContext, useEffect, useState, useMemo } from "react";
import { storeAsyncData } from "../hooks/asyncStorage";
import { authUserDetails } from "../../types";

import { getLogin, getUserDetails } from "../utils/utilityFunctions";

type AuthDetailsContextProvider = {
  children: React.ReactNode;
};

type AuthDetailsContextType = {
  isLoggedin: boolean;
  getUserData: authUserDetails | false;
  setUserData: any;
  signOut: any;
};

export const AuthDetailsContext = createContext<AuthDetailsContextType>(
  {} as AuthDetailsContextType
);

export const AuthDetailsContextProvider = ({
  children,
}: AuthDetailsContextProvider) => {
  const [authUser, setauthUser] = useState<authUserDetails | false>(false);
  const [login_status, setLoginStatus] = useState(false);
  //let login_status = false

  useEffect(() => {
    console.info(
      "Auth Details Context updated: " + AuthDetailsContextProvider.name
    );
    console.info("Latest Auth: " + JSON.stringify(authUser));
    console.info("Login Status Auth: " + login_status);

    return () => {};
  }, []);

  const setUserDataHandler = async (udata?: authUserDetails) => {
    try {
      let c_val: authUserDetails | null = null;
      //console.log('AuthDetails Context setUserDataHandler: '+JSON.stringify(udata))
      if (!udata) {
        getUserDetails().then((tresp) => {
          c_val = tresp;
          f_setData(c_val);
        });
      } else {
        c_val = udata;
        f_setData(c_val);
      }
    } catch (e) {
      console.log("Error in AuthDetailsContext > setUserDataHandler.");
    }
  };

  const f_setData = (c_val: authUserDetails | null) => {
    if (c_val) {
      let p_val = { ...authUser, ...c_val };
      //console.info(JSON.stringify(authUser))
      //console.info(JSON.stringify(c_val))
      console.info("Auth Details p_val:" + JSON.stringify(p_val));
      storeAsyncData(p_val, "userdetails");
      setauthUser(p_val);
      setLoginStatus(true);
      //login_status = true
    } else {
      //login_status = false
      setLoginStatus(false);
      setauthUser(false);
    }
  };

  const signOutHandler = () => {
    setLoginStatus(false);
    setauthUser(false);
  };

  const authMemo = useMemo((): AuthDetailsContextType => {
    return {
      isLoggedin: login_status,
      getUserData: authUser,
      signOut: signOutHandler,
      setUserData: setUserDataHandler,
    };
  }, [authUser, login_status]);

  return (
    <AuthDetailsContext.Provider value={authMemo}>
      {children}
    </AuthDetailsContext.Provider>
  );
};

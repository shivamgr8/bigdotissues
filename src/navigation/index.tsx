import React, { useContext, useEffect } from "react";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { ColorSchemeName } from "react-native";
import { getLogin, getUserDetails } from "../utils/utilityFunctions";
import { AuthContext } from "../hooks/AuthContext";
import { AuthDetailsContext } from "../hooks/AuthDetailsContext";
import LinkingConfiguration from "./LinkingConfiguration";
import LeftDrawer from "../navigation/LeftDrawer";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateTextSize } from "../services/redux/slices/storeSlice";
import { PrefetchContext } from "../hooks/PrefetchContext";
import { getSelectedSources } from "../services/redux/thunk/thunk";
import { navigationRef } from "../../RootNavigator";
import { AppConsolelog } from "../utils/commonFunctions";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  const dispatch = useDispatch();
  const prefetchContext = useContext(PrefetchContext);
  const authContext = useContext(AuthContext);
  const authDetailsContext = useContext(AuthDetailsContext);

  useEffect(() => {
    getTextSizes();
    getTheme();
    loginCheck();
    return () => {};
  }, []);

  const loginCheck = () => {
    getLogin().then((tResp) => {
      SelectedSource(tResp);
      console.log("Checking login:" + JSON.stringify(tResp));
      authContext.setUserData(tResp);
      AppConsolelog("---tResp----", tResp);
      if (tResp && tResp.uid) {
        getUserDetails()
          .then((tResp) => {
            AppConsolelog("---tRespDetails----", tResp);
            if (tResp && tResp.uid) {
              authDetailsContext.setUserData(tResp);
            }
          })
          .catch((error) => {
            AppConsolelog("--getUserDetailsError--", error);
          });
        return;
      }
    });
  };

  const getTextSizes = async () => {
    try {
      const value: any = await AsyncStorage.getItem("bigdot_text_sizes");
      if (value !== null && value != undefined) {
        let tJson = JSON.parse(JSON.parse(value));
        dispatch(updateTextSize(tJson));
      }
    } catch (e) {
      AppConsolelog("Error loading cached Text Size from AsyncStorage");
    }
  };

  const getTheme = async () => {
    try {
      const value: any = await AsyncStorage.getItem("bigdot_theme");
      if (value !== null && value != undefined) {
        let tJson = JSON.parse(JSON.parse(value));
        prefetchContext.setTheme(tJson);
      } else {
        prefetchContext.setTheme("system");
      }
    } catch (error) {
      AppConsolelog("--themError--", error);
    }
  };

  const SelectedSource = (tResp: any) => {
    if (tResp && tResp.uid) {
      dispatch(getSelectedSources(tResp.uid));
    } else {
      dispatch(getSelectedSources());
    }
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <LeftDrawer />
    </NavigationContainer>
  );
}

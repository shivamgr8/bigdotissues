import { FontAwesome } from "@expo/vector-icons";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState, useContext } from "react";
import { PrefetchContext } from "../hooks/PrefetchContext";
import {
  handleCategories,
  handleCategoriesPosts,
  isReachable,
} from "../utils/utilityFunctions";
import Colors from "../constants/Colors";
import useInternet from "./useInternet";

interface itemTypes {
  id: string;
  title: string;
}

interface cateTypes {
  status: string;
  Items: itemTypes;
}

export default function useCachedResources() {
  const context = useContext(PrefetchContext);
  const [isLoadingComplete, setLoadingComplete] = useState<boolean>(false);
  const [isFontsLoaded, setFontLoading] = useState(false);
  const [isCateChecked, setCateChecked] = useState(false);
  const [isCategoryPostsLoaded, setCatePostsLoading] = useState(false);

  //let ns = notificationsService()

  const internet = useInternet();

  //-- start: cache categories --
  const getCategories = () => {
    handleCategories().then((res) => {
      if (res && res === true) {
        return setCateChecked(true);
      } else {
        // add some error screen or message
        return;
      }
    });
  };

  const getCategoryPosts = async () => {
    handleCategoriesPosts().then((response) => {
      if (response) {
        return setCatePostsLoading(true);
      }
    });
  };

  const loadResourcesAndDataAsync = async () => {
    try {
      SplashScreen.preventAutoHideAsync();
      await Font.loadAsync({
        ...FontAwesome.font,
        Pacifico: require("../assets/fonts/Pacifico.ttf"),
        "Smooth-Circulars": require("../assets/fonts/Smooth-Circulars.otf"),
        "Gabriela-Semibold": require("../assets/fonts/Gabriela-Semibold.ttf"),
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.otf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.otf"),
        "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-Italic": require("../assets/fonts/Poppins-Italic.ttf"),
      });
    } catch (e) {
      // We might want to provide this error information to an error reporting service
      console.warn(e);
    } finally {
      setFontLoading(true);
    }
  };

  useEffect(() => {
    loadResourcesAndDataAsync();
    if (internet === true) {
      getCategories();
      getCategoryPosts();
      try {
        isReachable().then((resp) => {
          if (resp === false) {
            console.debug("Server error/timeout. Server taking too much time");
          }
        });
      } catch (e: any) {
        console.log("isReachable:" + e.message);
      }
    }
  }, [internet]);

  /*
  //-- do not delete
  useEffect(() => {
    console.log('From Notification Service: ' + JSON.stringify(ns))
  }, [ns.token])
  */

  //-- check all loaded --
  useEffect(() => {
    if (context.setTheme) {
      context.setTheme(Colors.light);
      console.log("Set Theme(usecachedResources.ts): " + context.theme);
    }

    if (isCateChecked && isFontsLoaded && isCategoryPostsLoaded) {
      setLoadingComplete(true);
    }
    console.info("isCateChecked: " + isCateChecked);
    console.info("isFontsLoaded: " + isFontsLoaded);
    console.info("isCategoryPostsLoaded: " + isCategoryPostsLoaded);

    return () => {};
  }, [isCateChecked, isFontsLoaded, isCategoryPostsLoaded]);

  return isLoadingComplete;
}

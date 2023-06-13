import React, { useState, useEffect, useCallback, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import CategoryScreen from "../screens/categories/CategoryScreen";
import CustomTabBar from "./CustomTabBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { catObjType } from "../../types";
import emitter from "../hooks/emitter";
import MyLoader from "../components/staticComponents/ScreenLoader";
import usePrefetchTheme from "../hooks/usePrefetchTheme";
import {
  apiGetRecentCategories,
  api_getPost,
} from "../services/network/apiServices";
import { handleCategories } from "../utils/utilityFunctions";
import { updateRecentCategory } from "../services/redux/slices/recentCategorySlice";
import { AppConsolelog } from "../utils/commonFunctions";
import { useDispatch } from "react-redux";
import { View } from "../components/Themed";
import CustomHeader from "./CustomHeader";

/* -- Home - Tabs for categories --  */
const TopTab = createMaterialTopTabNavigator();

export default function HomeCategoryTabs({ navigation }: any) {
  const dispatch = useDispatch();
  let theme = usePrefetchTheme();
  let colorScheme = useColorScheme();
  if (theme !== "light" && theme !== "dark") {
    theme = colorScheme;
  }
  const [catObj, setCategories] = useState<catObjType[]>([]);
  const [isCateLoading, setCateLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getCategories();
    emitter.addListener("refresh_categories", emitListener);
    return () => {
      emitter.removeAllListeners();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log("--refresh--", refresh);
      if (refresh) {
        setCateLoading(true);
        setCategories([]);
        getCategories();
        setRefresh(false);
        return;
      }
      return () => {};
    }, [refresh])
  );

  const emitListener = (t_emit_msg: string) => {
    if (t_emit_msg === "refresh") {
      setRefresh(true);
      setCateLoading(true);
      setCategories([]);
    } else if (t_emit_msg === "callApi") {
      setRefresh(true);
      handleCategories().then((res) => {
        if (res) {
          setCateLoading(true);
          setCategories([]);
          getCategories();
        }
      });
    } else if (t_emit_msg === "refreshApp") {
    }
  };

  const getCategories = async () => {
    try {
      const value: any = await AsyncStorage.getItem("bigdot_categories");
      if (value !== null && value != undefined) {
        let tArr = JSON.parse(JSON.parse(value));
        if (tArr !== undefined) {
          let carr = tArr.filter((t: catObjType) => t.status === true);
          setCategories(carr);
          setCateLoading(false);
        }
      }
    } catch (e) {
      AppConsolelog("Error loading categories from AsyncStorage");
    }
  };

  const customTabBar = (props: MaterialTopTabBarProps) => {
    return <CustomTabBar CateId="4" {...props} />;
  };

  if (isCateLoading || catObj.length == 0) {
    return (
      <TopTab.Navigator>
        <TopTab.Screen
          key="cate0"
          name="Loading"
          options={{
            title: "Loading",
            tabBarStyle: {
              backgroundColor: Colors[theme].background,
            },
          }}
          component={MyLoader}
        />
      </TopTab.Navigator>
    );
  } else {
    return (
      <>
        <CustomHeader navigation={navigation} />
        <TopTab.Navigator tabBar={(props) => customTabBar(props)}>
          {catObj.map((item, index) => (
            <TopTab.Screen
              key={"cate" + item.id}
              initialParams={{
                CateId: item.id,
                Title: item.title,
              }}
              name={item.title
                .toLowerCase()
                .replace(/ /g, "")
                .replace(/[^\w-]+/g, "")}
              options={{
                title: item.title,
              }}
              component={CategoryScreen}
            />
          ))}
        </TopTab.Navigator>
      </>
    );
  }
}

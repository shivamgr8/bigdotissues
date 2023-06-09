import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  useDrawerStatus,
} from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { SafeAreaView } from "react-native-safe-area-context";
import {
  Platform,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { catObjType } from "../../types";
import { HeadingText, Text, View } from "../components/Themed";
import ButtonRecent from "../components/buttons/ButtonRecent";
import LeftDrawerItem from "../components/buttons/LeftDrawerItem";
import RootNavigator from "./RootNavigator";
import ImageTabBarIcon from "../components/ImageTabBarIcon";
import usePrefetchTheme from "../hooks/usePrefetchTheme";
import { AppConsoleinfo, AppConsolelog } from "../utils/commonFunctions";
import { AuthContext } from "../hooks/AuthContext";
import { apiGetRecentCategories } from "../services/network/apiServices";
import { useSelector } from "react-redux";
import { isJsonString } from "../utils/utilityFunctions";
import { useDispatch } from "react-redux";
import { updateRecentCategory } from "../services/redux/slices/recentCategorySlice";

let sw = Math.round(Dimensions.get("screen").width - 78);
let isSmallScreen = Dimensions.get("screen").width >= 320;

type itemType = {
  CateId: string;
  Title: string;
  count: string;
  slug: string;
};

export default function LeftDrawer() {
  const Drawer = createDrawerNavigator();
  const authContext = useContext(AuthContext);
  let theme = usePrefetchTheme();
  let colorScheme = useColorScheme();
  if (theme !== "light" && theme !== "dark") {
    theme = colorScheme;
  }

  function CustomTopHeader({ navigation }: any) {
    return (
      <View
        style={[
          styles.customHeader,
          {
            width: sw,
          },
        ]}
      >
        <View style={{ marginLeft: "auto", marginRight: "auto" }}>
          <ImageTabBarIcon
            myasset_name="headerlogo"
            focused={false}
            style={styles.logoHeader}
          />
        </View>
        <View style={styles.bellCont}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("BigdotAlertScreen");
            }}
          >
            <ImageTabBarIcon
              myasset_name="bellIcon"
              focused={false}
              style={styles.bellImg}
            />
            <View style={styles.bellDot}></View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function RecentCategories(props: { recent_data: itemType[] }) {
    return (
      <View className="flex-row">
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {props.recent_data.map((item, index) => {
            return (
              <ButtonRecent
                key={"rec" + index}
                title={item.Title}
                slug={item.slug}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  }

  function CustomDrawerContent(props: DrawerContentComponentProps) {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const onlineRecentCategorydata = useSelector(
      (state: any) => state.recentCategorySlice.recentCategoryData
    );
    const [catObj, setCategories] = useState<any[]>([]);
    const [recent_arr, setRecent] = useState<itemType[]>([]);
    const [isDrawerOpen, setisDrawerOpen] = useDrawerStatus();

    useEffect(() => {
      updateRecent();
      getCategories();
      return () => {};
    }, [isDrawerOpen]);

    useEffect(() => {
      setRecent([]);
      getRecentCategory();
      return () => {};
    }, [authContext.getUserData]);

    const updateRecent = () => {
      try {
        if (authContext.getUserData === false) {
          AsyncStorage.getItem("bigdot_recent_categories").then(
            (recent_resp: any) => {
              if (recent_resp != null || recent_resp != undefined) {
                let recent_arr = JSON.parse(JSON.parse(recent_resp));
                setRecent(recent_arr.reverse());
              }
            }
          );
        } else {
          let newArray = [...onlineRecentCategorydata];
          if (onlineRecentCategorydata && onlineRecentCategorydata.length) {
            setRecent(newArray.reverse());
          }
        }
      } catch (error) {
        AppConsolelog("--error--", error);
      }
    };

    const getCategories = async () => {
      try {
        const value: any = await AsyncStorage.getItem("bigdot_categories");
        if (value !== null && value != undefined) {
          let parseValue = JSON.parse(JSON.parse(value));
          if (parseValue !== undefined) {
            let carr = parseValue.filter((t: catObjType) => t.status === true);
            setCategories(carr);
          }
        }
      } catch (e) {
        AppConsolelog("--getCategoriesError--", e);
      }
    };

    const getRecentCategory = async () => {
      try {
        const value: any = await AsyncStorage.getItem("bigdot_categories");
        if (authContext.getUserData !== false && value) {
          apiGetRecentCategories(authContext.getUserData.uid).then((res) => {
            if (res && res.status === "success") {
              let parseLocalCategory = JSON.parse(JSON.parse(value));
              let onlineCategory = res?.data;
              AppConsolelog("--resRecent--", res);
              if (
                parseLocalCategory &&
                onlineCategory &&
                onlineCategory.length
              ) {
                const filterCategory = parseLocalCategory.filter(
                  (item: catObjType) => item.status === true
                );
                const newData = filterCategory.filter((item: any) => {
                  if (onlineCategory.includes(parseInt(item.id, 10))) {
                    item.slug = item.title.toLowerCase();
                    item.count = filterCategory?.length;
                    item.CateId = item.id;
                    item.Title = item.title;
                    delete item.category_image;
                    delete item.status;
                    delete item.title;
                    delete item.id;
                    delete item.order;
                    return true;
                  }
                });
                dispatch(updateRecentCategory(newData));
              } else {
                let value: any = [];
                dispatch(updateRecentCategory(value));
                setRecent([]);
              }
            }
          });
        }
      } catch (error) {
        AppConsolelog("--errorWhileGetRecentCategory--", error);
      }
    };

    return (
      <SafeAreaView>
        <ScrollView>
          <View>
            <View
              className="flex-row items-center justify-between"
              style={[
                styles.topHeaderBar,
                {
                  //@ts-ignore
                  borderBottomColor: Colors[theme].shadowColor,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => props.navigation.toggleDrawer()}
                activeOpacity={0.7}
              >
                <ImageTabBarIcon
                  myasset_name="close"
                  focused={false}
                  style={styles.closeIcon}
                />
              </TouchableOpacity>
              <View>
                <ImageTabBarIcon
                  myasset_name="headerlogo"
                  style={styles.logoHeader}
                />
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Auth", { screen: "Settings" })
                }
              >
                <ImageTabBarIcon
                  myasset_name="settings"
                  focused={false}
                  style={styles.settingIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 0 }}>
              {recent_arr.length > 0 ? (
                <View style={{ paddingLeft: 22 }}>
                  <HeadingText
                    style={{
                      fontSize: 13,
                      lineHeight: 30,
                      paddingTop: 4,
                      marginBottom: 4,
                    }}
                  >
                    Recently Visited
                  </HeadingText>
                  <RecentCategories recent_data={recent_arr} />
                </View>
              ) : null}
              <View style={{ marginTop: 33, paddingHorizontal: 22 }}>
                {catObj != undefined
                  ? catObj.map((item, index) => (
                      <LeftDrawerItem
                        key={"leftnav" + index}
                        title={item.title}
                      />
                    ))
                  : null}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <Drawer.Navigator
      id="LeftDrawer"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name="Home"
        component={RootNavigator}
        options={({ navigation }) => {
          return {
            headerShown: false,
            gestureEnabled: true,
            swipeEnabled: false,
            headerShadowVisible: false,
            // headerStyle: {
            //   //@ts-ignore
            //   backgroundColor: Colors[theme].background,
            // },
            // headerTitle: (props: any) => (
            //   <CustomTopHeader navigation={navigation} {...props} />
            // ),
            // headerLeft: () => (
            //   <TouchableOpacity
            //     onPress={() => navigation.toggleDrawer()}
            //     activeOpacity={0.7}
            //     style={{
            //       height: "60%",
            //       justifyContent: "center",
            //     }}
            //   >
            //     <ImageTabBarIcon
            //       myasset_name="drawericon"
            //       focused={false}
            //       style={styles.toggleIcon}
            //     />
            //   </TouchableOpacity>
            // ),
            drawerStyle: {
              width: isSmallScreen ? "70%" : "100%",
              height: "100%",
              //@ts-ignore
              backgroundColor: Colors[theme].background,
            },
          };
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  bigdot: {
    width: 32,
    height: 32,
  },
  topHeaderBar: {
    borderBottomWidth: 0.5,
    paddingVertical: 9,
    paddingLeft: 22,
    paddingRight: 18,
  },
  toggleIcon: {
    width: 17,
    height: 17,
    marginLeft: 22,
    marginRight: 0,
  },
  logoHeader: {
    width: 70,
    height: 28,
    alignSelf: "center",
    resizeMode: "contain",
  },
  tabBarStyle: {
    backgroundColor: "red",
  },
  bell: {
    fontSize: 20,
    paddingTop: 4,
    position: "relative",
  },
  bellImg: {
    width: 20,
    height: 20,
  },
  bellDot: {
    width: 8,
    height: 8,
    borderRadius: 50,
    backgroundColor: "#0db04b",
    position: "absolute",
    top: 3,
    right: 1,
  },
  customHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 28,
  },
  closeIcon: {
    width: 15,
    height: 15,
    resizeMode: "cover",
  },
  settingIcon: {
    width: 18,
    height: 18,
    resizeMode: "cover",
  },
  bellCont: {
    ...Platform.select({
      ios: {
        paddingRight: 10,
      },
      android: {
        paddingRight: 0,
      },
      default: {
        // other platforms, web for example
        paddingRight: 10,
      },
    }),
  },
});

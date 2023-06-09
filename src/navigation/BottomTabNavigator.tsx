import React, { useRef } from "react";
import {
  FontAwesome,
  Ionicons,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigation,
  DrawerActions,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBar,
} from "@react-navigation/material-top-tabs";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";

import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Platform,
  ColorSchemeName,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  ImageRequireSource,
  ImageURISource,
  ImageSourcePropType,
  Text,
} from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import NotFoundScreen from "../screens/notFound/NotFoundScreen";
import HomeCategoryTabs from "./HomeCategoryTabs";

import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../../types";

import ImageTabBarIcon from "../components/ImageTabBarIcon";
import usePrefetchTheme from "../hooks/usePrefetchTheme";
import emitter from "../hooks/emitter";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { View } from "../components/Themed";

const TopTab = createMaterialTopTabNavigator();

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
//const BottomTab = createBottomTabNavigator<RootTabParamList>();
const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  let theme = usePrefetchTheme();
  let def_theme = useColorScheme();
  if (theme !== "light" && theme !== "dark") {
    theme = def_theme;
  }

  const navigation = useNavigation();

  return (
    <BottomTab.Navigator
      //options={{ headerTitle: (props:any) => <CustomTopHeader {...props} /> }}
      initialRouteName="Home"
      screenListeners={{
        focus: (e) => {
          // console.log("--e--", e);
          let tabName = e.target?.split("-")[0];
          if (tabName == "HomeCategoryTabs") {
            navigation.getParent()?.setOptions({ headerShown: false });
          } else {
            navigation.getParent()?.setOptions({ headerShown: false });
          }
        },
        tabPress: (e) => {
          // Do something with the state
          // console.log("--e----", e);
          let tname = e.target?.split("-")[0];
          if (tname == "HomeCategoryTabs") {
            navigation.getParent()?.setOptions({ headerShown: true });
          } else {
            navigation.getParent()?.setOptions({ headerShown: false });
          }
          console.log("state changed", tname);
          // eslint-disable-next-line
          // @ts-ignore
          //navigation.navigate(tname)
        },
      }}
      screenOptions={{
        tabBarItemStyle: {
          paddingVertical: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "Poppins-SemiBold",
        },
        headerShown: false,
        tabBarActiveTintColor: Colors[theme].tint,
        tabBarInactiveTintColor: Colors[theme].headingtext,
        tabBarStyle: [
          styles.bottombarstyle,
          {
            backgroundColor: Colors[theme].background,
            borderTopColor: theme === "dark" ? "#00000026" : "#e2e2e280",
          },
        ],
        //headerTitle: (props:any) => <CustomTopHeader {...props} />
        //headerStyle: { backgroundColor: '#0000cc55' }
      }}
    >
      <TopTab.Group>
        <TopTab.Screen
          name="HomeCategoryTabs"
          component={HomeCategoryTabs}
          options={{
            title: "Home",
            tabBarShowLabel: true,
            //headerShown: true, //-- working
            //tabBarIcon: ({ focused, color }) => <TabBarIcon name="home" color={color} focused={focused} />,
            tabBarIcon: ({ focused, color }) => (
              <View>
                {focused ? (
                  <TouchableWithoutFeedback>
                    <ImageTabBarIcon
                      myasset_name="homeicon"
                      focused={focused}
                      style={styles.footerIconSize}
                    />
                  </TouchableWithoutFeedback>
                ) : (
                  <TouchableWithoutFeedback>
                    <ImageTabBarIcon
                      myasset_name="homeicon"
                      focused={false}
                      style={styles.footerIconSize}
                    />
                  </TouchableWithoutFeedback>
                )}
              </View>
            ),
          }}
        />
      </TopTab.Group>
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color?: string;
  focused?: boolean;
}) {
  let tcolor: string = "";
  const colorScheme = useColorScheme();
  if ((colorScheme == "dark" || colorScheme == "light") && props.focused) {
    tcolor = Colors[colorScheme].tint;
  } else {
    tcolor = Colors[colorScheme].text;
  }
  return (
    <FontAwesome
      size={30}
      style={{ marginBottom: -3, paddingBottom: 0, color: tcolor }}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  bigdot: {
    width: 32,
    height: 32,
  },
  toggleicon: {
    width: 17,
    height: 17,
    marginLeft: 22,
    marginRight: 10,
  },
  logoheader: {
    width: 70,
    height: 27,
    alignSelf: "center",
  },
  bottombarstyle: {
    height: 68,
    paddingTop: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 5,
    zIndex: 1,
    // marginTop: 2,
    borderTopWidth: 2,
    ...Platform.select({
      ios: {
        height: 68,
        paddingBottom: 5,
      },
      android: {
        paddingBottom: 5,
      },
      default: {
        // other platforms, web for example
        paddingBottom: 5,
      },
    }),
    // shadowOffset: {
    //   width: 0,
    //   height: 12,
    // },
    // shadowOpacity: 0.58,
    // shadowRadius: 16.0,
    // elevation: 24,
    // position: "absolute",
    // bottom: 0,
    // padding: 10,
    // width: "100%",
    // height: 68,
    // zIndex: 1,
  },
  bell: {
    fontSize: 20,
    paddingTop: 4,
    position: "relative",
  },
  custheader: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-end",
    height: 28,
  },
  footerIconSize: {
    width: 27,
    height: 27,
    resizeMode: "contain",
  },
  recentbtn: {},
});

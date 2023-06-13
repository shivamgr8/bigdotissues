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
} from "react-native";
import React, { useEffect } from "react";

import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../../types";

import ImageTabBarIcon from "../components/ImageTabBarIcon";
import PostDetailScreen from "../screens/newsPosts/postDetails/PostDetailScreen";

// ================== Auth Stack ===================
const PostStack = createNativeStackNavigator();
export default function PostDetailNavigator() {
  return (
    <PostStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <PostStack.Screen
        name="PostDetailScreen"
        component={PostDetailScreen}
        options={{ title: "PostDetailScreen" }}
      />
    </PostStack.Navigator>
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
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
    marginTop: 2,
    ...Platform.select({
      ios: {
        height: 70,
        paddingBottom: 20,
      },
      android: {
        paddingBottom: 10,
      },
      default: {
        // other platforms, web for example
        paddingBottom: 10,
      },
    }),
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
  recentbtn: {},
});

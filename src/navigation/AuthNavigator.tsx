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

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import ModalScreen from "../screens/dummyFolder/ModalScreen";
import NotFoundScreen from "../screens/notFound/NotFoundScreen";
import HomeCategoryTabs from "./HomeCategoryTabs";
import DigestTabsScreen from "../screens/digest/digestTab/DigestTabsScreen";
import TimeDigestScreen from "../screens/digest/timeDigest/timeDigestScreen/TimeDigestScreen";
import SearchScreen from "../screens/search/SearchScreen";
import SettingsScreen from "../screens/settings/settingsScreen/SettingsScreen";

import LoginScreen from "../screens/auth/login/LoginScreen";
import ForgotPasswordScreen from "../screens/auth/forgotPassword/ForgotPasswordScreen";
import OtpScreen from "../screens/auth/otp/OtpScreen";
import CreateAccountScreen from "../screens/auth/createAccount/CreateAccountScreen";
import AccountScreen from "../screens/auth/userAccount/AccountScreen";
import UpdateProfileComponent from "../screens/auth/userAccount/UpdateProfileComponent";
import UpdateEmailAddress from "../screens/auth/userAccount/UpdateEmailAddress";
import UpdatePhoneNumber from "../screens/auth/userAccount/UpdatePhoneNumber";
import SetPassword from "../screens/auth/userAccount/SetPassword";

import {
  RootStackParamList,
  RootTabParamList,
  RootTabScreenProps,
} from "../../types";

import ImageTabBarIcon from "../components/ImageTabBarIcon";
import { AuthDetailsContextProvider } from "../hooks/AuthDetailsContext";

// ================== Auth Stack ===================
const AuthStack = createNativeStackNavigator();
export default function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
      <AuthStack.Screen name="Otp" component={OtpScreen} />
      <AuthStack.Screen name="CreateAccount" component={CreateAccountScreen} />
      <AuthStack.Screen name="Account" component={AccountScreen} />
      <AuthStack.Screen
        name="UpdateProfile"
        component={UpdateProfileComponent}
      />
      <AuthStack.Screen name="UpdateEmail" component={UpdateEmailAddress} />
      <AuthStack.Screen name="UpdatePhone" component={UpdatePhoneNumber} />
      <AuthStack.Screen name="SetPassword" component={SetPassword} />
    </AuthStack.Navigator>
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

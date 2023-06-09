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
import NotFoundScreen from "../screens/notFound/NotFoundScreen";
import BottomTabNavigator from "../navigation/BottomTabNavigator";
import PostDetailNavigator from "./PostDetailNavigator";
import PostsDetailList from "../screens/newsPosts/postDetails/PostsDetailList";

const myTheme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#ffffff",
    accent: "#ffffff",
    background: "#1e1e1e",
  },
};

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
//const Stack = createNativeStackNavigator<RootStackParamList>();
const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors[colorScheme].background },
      }}
    >
      <Stack.Group>
        <Stack.Screen
          name="Root"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="PostDetailNavigator"
          component={PostDetailNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PostsDetailList"
          component={PostsDetailList}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NotFound"
          component={NotFoundScreen}
          options={{ title: "Oops!" }}
        />
      </Stack.Group>
    </Stack.Navigator>
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

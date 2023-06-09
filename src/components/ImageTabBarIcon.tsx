import {} from "react-native";
import {
  FontAwesome,
  Ionicons,
  MaterialIcons,
  Entypo,
  SimpleLineIcons,
} from "@expo/vector-icons";
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

import { HeadingText, Text, View } from "../components/Themed";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

import MyAssets from "../assets/MyAssets";
import usePrefetchTheme from "../hooks/usePrefetchTheme";

export default function ImageTabBarIcon(props: {
  myasset_name: string;
  focused?: boolean;
  style?: any;
}) {
  let theme = usePrefetchTheme(); //useColorScheme();
  let def_theme = useColorScheme();
  if (theme != "light" && theme != "dark") theme = def_theme;
  let tcolor: string = "";
  let imgpath: ImageSourcePropType;
  const colorScheme = useColorScheme();
  // console.log("---focused---", props.focused);
  tcolor = Colors[theme].tint; // color based on scheme

  if (!props.focused) {
    imgpath = MyAssets[props.myasset_name as keyof typeof MyAssets][theme];
  } else {
    imgpath = MyAssets[props.myasset_name as keyof typeof MyAssets]["active"];
  }

  return (
    <View>
      <Image source={imgpath} style={[styles.bigdot, props.style]} />
    </View>
  );
}

const styles = StyleSheet.create({
  bigdot: {
    width: 32,
    height: 32,
  },
});

/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */
import React, { useContext, useState } from "react";
import { PrefetchContext } from "../hooks/PrefetchContext";
import {
  Text as DefaultText,
  View as DefaultView,
  Pressable as DefaultPressable,
  TextStyle,
} from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import usePrefetchTheme from "../hooks/usePrefetchTheme";
import { isGetAccessor } from "typescript";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useThemeColor(
  props: { light?: string; dark?: string; system?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  let theme = usePrefetchTheme(); //useColorScheme();
  let def_theme = useColorScheme();
  if (theme != "light" && theme != "dark") theme = def_theme;

  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
  svg?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const fSize = useThemeColor(
    { light: lightColor, dark: darkColor },
    "textsize"
  );
  const fontSize = parseInt(fSize);
  return (
    <DefaultText
      style={[
        { color },
        { fontSize },
        { fontFamily: "Poppins-Regular" },
        style,
      ]}
      {...otherProps}
    />
  );
}

export function HeadingText(props: TextProps) {
  const context = useContext(PrefetchContext);
  // const [textSize, setTextSize] = useState<any>("");

  // AsyncStorage.getItem("bigdot_text_sizes").then((res: any) => {
  //   setTextSize(JSON.parse(res));
  // });

  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "headingtext"
  );

  return (
    <DefaultText
      style={[
        { color },
        {
          fontFamily: "Gabriela-Semibold",
          fontSize: 24,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function Pressable(props: any) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <DefaultPressable style={[{ backgroundColor }, style]} {...otherProps} />
  );
}

export function IconView(props: ViewProps) {
  const { style, svg, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  if (svg != undefined) {
    console.log(`../../assets/images/${svg}`);
  }
  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

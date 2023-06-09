import React, { useRef } from "react";
import {
  Animated,
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
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
  useNavigation,
  DrawerActions,
} from "@react-navigation/native";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBar,
  MaterialTopTabBarProps,
} from "@react-navigation/material-top-tabs";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { HeadingText, Text, View } from "../components/Themed";
import CategoryScreen from "../screens/categories/CategoryScreen";

const DISTANCE_BETWEEN_TABS = 20;

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
  position,
}: MaterialTopTabBarProps) {
  const colorScheme = useColorScheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const transform: any = [];

  return (
    <View style={{ flexDirection: "row" }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title;
        /*const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
          */
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            // eslint-disable-next-line
            // @ts-ignore
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        const inputRange = state.routes.map((_, i) => i);
        const opacity = position.interpolate({
          inputRange,
          outputRange: inputRange.map((i) => (i === index ? 1 : 0.5)),
        });

        return (
          <View style={styles.contentContainer}>
            <Animated.ScrollView
              horizontal
              ref={scrollViewRef}
              showsHorizontalScrollIndicator={false}
              style={styles.container}
            >
              {label}
              <Animated.View style={[styles.indicator, { transform }]} />
            </Animated.ScrollView>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    paddingHorizontal: DISTANCE_BETWEEN_TABS / 2,
  },
  container: {
    backgroundColor: "black",
    flexDirection: "row",
    height: 34,
  },
  contentContainer: {
    height: 34,
    marginTop: 30,
  },
  indicator: {
    backgroundColor: "white",
    bottom: 0,
    height: 3,
    left: 0,
    position: "absolute",
    right: 0,
    // this must be 1 for the scaleX animation to work properly
    width: 1,
  },
  text: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
});

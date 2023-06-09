import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Button,
  TouchableOpacity,
  Touchable,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
  I18nManager,
  LayoutChangeEvent,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Text, View, HeadingText, IconView } from "../components/Themed";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/native";
import usePrefetchTheme from "../hooks/usePrefetchTheme";
import MyAssets from "../assets/MyAssets";
import ImageTabBarIcon from "../components/ImageTabBarIcon";

const screenWidth = Dimensions.get("window").width;

const DISTANCE_BETWEEN_TABS = 25;

interface extendMaterialTopTabBarProps extends MaterialTopTabBarProps {
  cid: string;
}

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
  position,
}: extendMaterialTopTabBarProps): JSX.Element => {
  let theme = usePrefetchTheme(); //useColorScheme();
  let def_theme = useColorScheme();
  if (theme !== "light" && theme !== "dark") {
    theme = def_theme;
  }

  const colorScheme = useColorScheme();
  const [widths, setWidths] = useState<(number | undefined)[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const transform = [];
  const inputRange = state.routes.map((_, i) => i);

  //------------------start: handle navigation and back button----------------------------
  const pnavigation = useNavigation();
  useEffect(() => {
    pnavigation.getParent()?.getParent()?.setOptions({
      headerShown: false,
    });
    return () => {
      pnavigation.getParent()?.getParent()?.setOptions({
        headerShown: true,
      });
    };
  }, [pnavigation]);
  //------------------end: handle navigation and back button----------------------------

  // keep a ref to easily scroll the tab bar to the focused label
  const outputRangeRef = useRef<number[]>([]);

  const getTranslateX = (
    position: any, //Animated.AnimatedInterpolation,
    routes: never[],
    widths: number[]
  ) => {
    const outputRange = routes.reduce((acc, _, i: number) => {
      if (i === 0) return [DISTANCE_BETWEEN_TABS / 2 + widths[0] / 2];
      return [
        ...acc,
        acc[i - 1] + widths[i - 1] / 2 + widths[i] / 2 + DISTANCE_BETWEEN_TABS,
      ];
    }, [] as number[]);
    outputRangeRef.current = outputRange;
    const translateX = position.interpolate({
      inputRange,
      outputRange,
      extrapolate: "clamp",
    });
    return Animated.multiply(translateX, I18nManager.isRTL ? -1 : 1);
  };

  // compute translateX and scaleX because we cannot animate width directly
  if (
    state.routes.length > 1 &&
    widths.length === state.routes.length &&
    !widths.includes(undefined)
  ) {
    const translateX = getTranslateX(
      position,
      state.routes as never[],
      widths as number[]
    );
    transform.push({
      translateX,
    });

    const outputRange = inputRange.map((_, i) => widths[i]) as number[];

    transform.push({
      scaleX:
        state.routes.length > 1
          ? position.interpolate({
              inputRange,
              outputRange,
              extrapolate: "clamp",
            })
          : outputRange[0],
    });
  }

  // scrolls to the active tab label when a new tab is focused
  useEffect(() => {
    if (
      state.routes.length > 1 &&
      widths.length === state.routes.length &&
      !widths.includes(undefined)
    ) {
      if (state.index === 0) {
        scrollViewRef.current?.scrollTo({
          x: 0,
        });
      } else {
        // keep the focused label at the center of the screen
        scrollViewRef.current?.scrollTo({
          x: (outputRangeRef.current[state.index] as number) - screenWidth / 2,
        });
      }
    }
  }, [state.index, state.routes.length, widths]);

  // get the label widths on mount
  const onLayout = (event: LayoutChangeEvent, index: number) => {
    const { width } = event.nativeEvent.layout;
    const newWidths = [...widths];
    newWidths[index] = width - DISTANCE_BETWEEN_TABS;
    setWidths(newWidths);
  };

  // basic labels as suggested by react navigation
  const labels = state.routes.map((route, index) => {
    const { options } = descriptors[route.key];
    const label = route.name;
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
    const inputRange = state.routes.map((_, i) => i);
    const opacity = position.interpolate({
      inputRange,
      outputRange: inputRange.map((i) => (i === index ? 1 : 0.9)),
    });
    const activeColor = (tindex: number) => {
      if (theme == "system") theme = colorScheme;
      let tcolor = Colors[theme].text;
      isFocused ? (tcolor = Colors[theme].tint) : (tcolor = Colors[theme].text);
      return tcolor;
    };
    const activeFontWeight = (tindex: number) => {
      return isFocused ? "Poppins-Bold" : "Poppins-Regular";
    };

    return (
      <TouchableWithoutFeedback
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        onPress={onPress}
        style={styles.button}
      >
        <View
          onLayout={(event) => onLayout(event, index)}
          style={styles.buttonContainer}
        >
          <Animated.Text
            style={[
              styles.text,
              {
                opacity,
                color: activeColor(index),
                fontFamily: activeFontWeight(index),
              },
            ]}
          >
            {label}
          </Animated.Text>
        </View>
      </TouchableWithoutFeedback>
    );
  });

  return (
    <View
      style={[
        styles.contentContainer,
        {
          backgroundColor: Colors[theme].background,
          shadowColor: theme === "dark" ? "#000000" : "#000000",
        },
      ]}
    >
      <StatusBar
        translucent={false}
        backgroundColor={Colors[theme].background}
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <View style={styles.digestheadpart}>
        <ImageTabBarIcon
          myasset_name="settingLogo"
          style={{ width: 135, height: 34 }}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate("Auth", { screen: "Settings" })}
        >
          <ImageTabBarIcon
            myasset_name="settings"
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        horizontal
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        style={[
          styles.container,
          { backgroundColor: Colors[theme].background },
        ]}
      >
        {labels}
        <Animated.View
          style={[
            styles.indicator,
            { transform, backgroundColor: Colors[colorScheme].tint },
          ]}
        />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  digestheadpart: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 22,
    paddingVertical: 6,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    //paddingHorizontal: DISTANCE_BETWEEN_TABS / 2,
    //backgroundColor:"#fff",
    flex: 1,
    paddingHorizontal: 15,
  },
  container: {
    flexDirection: "row",
  },
  contentContainer: {
    //backgroundColor:"#ffffff",
    height: 89,
    marginTop: 0,
    // borderBottomColor: "#e2e2e2",
    // borderBottomWidth: 1,
    elevation: 4,
    zIndex: 1,
  },
  indicator: {
    bottom: 0,
    height: 3,
    left: 0,
    position: "absolute",
    right: 0,
    // this must be 1 for the scaleX animation to work properly
    width: 1,
  },
  text: {
    textTransform: "capitalize",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
});

export default CustomTabBar;

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
} from "react-native";
import { Text, View,HeadingText,IconView } from '../components/Themed';
import Colors from "../constants/Colors";
import useColorScheme from '../hooks/useColorScheme';

const screenWidth = Dimensions.get("window").width - 24;  //--praveen --- subtract the padding

const DISTANCE_BETWEEN_TABS = 22;

interface extendMaterialTopTabBarProps extends MaterialTopTabBarProps{
  CateId:string;
  Title?:string;
}

const CustomTabBar = ({state, descriptors, navigation, position}: extendMaterialTopTabBarProps): JSX.Element => {
  const colorScheme = useColorScheme();
  const [widths, setWidths] = useState<(number | undefined)[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const transform = [];
  const inputRange = state.routes.map((_, i) => i);

  const [cont_width, setContWidth] = useState(0) //--- by praveen

  // keep a ref to easily scroll the tab bar to the focused label
  const outputRangeRef = useRef<number[]>([]);

  const getTranslateX = (
    position: Animated.AnimatedInterpolation<''>,
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
          x: (outputRangeRef.current[state.index] as number) - (screenWidth) / 2,
        });
        
      }
    }
  }, [state.index, state.routes.length, widths]);


  // get the label widths on mount
  const onLayout = (event: LayoutChangeEvent, index: number) => {
    //console.log(event.nativeEvent)
    const { width } = event.nativeEvent.layout;
    const newWidths = [...widths];
    newWidths[index] = width - DISTANCE_BETWEEN_TABS;
    setWidths(newWidths);
  };

  // basic labels as suggested by react navigation
  const labels = state.routes.map((route, index) => {
    const { options } = descriptors[route.key];
    //const label = route.name;
    // eslint-disable-next-line
    // @ts-ignore
    const label = route.params?.Title
    //const label = state
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
      outputRange: inputRange.map((i) => (i === index ? 1 : 1)), //-- this sets the opacity of non active tabs
    });
    
    const activeColor = (tindex:number) =>{
      let tcolor = Colors[colorScheme].headingtext
      isFocused ? tcolor=Colors[colorScheme].tint : tcolor=Colors[colorScheme].headingtext
      return tcolor
    };
    const activeFontWeight = (tindex:number) =>{      
      return (isFocused)?"Poppins-SemiBold":"Poppins-Regular"
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
          <Text style={[styles.text, { color:activeColor(index),fontFamily:activeFontWeight(index) }]}>
            {label}
          </Text>
        </View>      
      </TouchableWithoutFeedback>
    );
  });
  
  return (
    <View style={[styles.contentContainer, {backgroundColor:Colors[colorScheme].background}]}>
      <Animated.ScrollView
        horizontal
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        style={[styles.container, {backgroundColor: Colors[colorScheme].background }]}
      >
        {labels}
        <Animated.View style={[styles.indicator, { transform, backgroundColor:Colors[colorScheme].tint}]} />
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    paddingHorizontal: DISTANCE_BETWEEN_TABS / 2.8,
    //backgroundColor:"#fff",
    //borderRightWidth:1,
  },
  container: {    
    flexDirection: "row",
    height: 26,        
  },
  contentContainer: {
    //backgroundColor:"#ff0000",
    height: 26,
    marginTop: 0,
    paddingLeft:15,
    paddingRight:15,
    borderBottomColor: '#e2e2e2',
    borderBottomWidth: 0,  
    shadowColor: "#000",
    shadowOffset:{
    width: 0,
    height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    zIndex:1,
  },
  indicator: {    
    bottom: 0,
    height: 3,
    left: 0,
    position: "absolute",
    right: 0,
    // this must be 1 for the scaleX animation to work properly
    width: 1,
    //backgroundColor:'red'
  },
  text: {
    color: "#333333",
    textTransform:"capitalize",
    fontSize: 12,
    textAlign: "center",
    fontFamily: 'Poppins-Regular',
  },
});

export default CustomTabBar;
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import useCachedResources from "./src/hooks/useCachedResources";
import useColorScheme from "./src/hooks/useColorScheme";
import Navigation from "./src/navigation";
import { Text, HeadingText, View, Pressable } from "./src/components/Themed";
import * as SplashScreen from "expo-splash-screen";
import { PrefetchContextProvider } from "./src/hooks/PrefetchContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeAsyncData } from "./src/hooks/asyncStorage";
import BigdotAlerts from "./src/components/BigdotAlerts";
import { store } from "./src/services/redux/store/store";
import { Provider } from "react-redux";
import Colors from "./src/constants/Colors";
import { AppConsolelog } from "./src/utils/commonFunctions";
import useInternet from "./src/hooks/useInternet";

// const sw = Dimensions.get("screen").width - 16;
// eslint-disable-next-line
// @ts-ignore
TouchableOpacity.defaultProps = {
  //@ts-ignore
  ...(TouchableOpacity.defaultProps || {}),
  delayPressIn: 0,
};

// eslint-disable-next-line
// @ts-ignore
if (Text.defaultProps == null) {
  // @ts-ignore
  Text.defaultProps = {}; // @ts-ignore
  Text.defaultProps.allowFontScaling = false;
  // @ts-ignore
  HeadingText.defaultProps = {}; // @ts-ignore
  HeadingText.defaultProps.allowFontScaling = false;
}
export default function App() {
  const [isFirstTime, setFirstTime] = useState(true);
  const colorScheme = useColorScheme();
  let isLoadingComplete = useCachedResources();
  let internetStatus = useInternet();

  useEffect(() => {
    CheckFirstTime();
    return () => {};
  }, []);

  const CheckFirstTime = async () => {
    try {
      //AsyncStorage.removeItem('bigdot_firsttime') // uncomment to debug first screen
      const value: any = await AsyncStorage.getItem("bigdot_firsttime");
      console.info("App.tsx: First time value from Asynrc: " + value);
      if (value == null || value == undefined) {
        storeAsyncData("1", "firsttime");
      } else {
        setFirstTime(false);
      }
    } catch (e) {
      AppConsolelog("--error reading value--");
    }
  };

  const handleFirstTime = () => {
    setFirstTime(false);
  };

  console.log("--internetStatus--", internetStatus);
  if (isLoadingComplete === true) {
    setTimeout(function () {
      SplashScreen.hideAsync();
    }, 1000);

    //console.info('is FirstTime: '+ isFirstTime)
    return (
      <Provider store={store}>
        <PrefetchContextProvider>
          <SafeAreaProvider>
            <Navigation colorScheme={colorScheme} />
            <BigdotAlerts />
            <StatusBar
              translucent={false}
              backgroundColor={Colors[colorScheme].background}
            />
          </SafeAreaProvider>
        </PrefetchContextProvider>
      </Provider>
    );
  } else if (isLoadingComplete === false && internetStatus === false) {
    setTimeout(function () {
      SplashScreen.hideAsync();
    }, 1000);
    return (
      <View style={styles.modal_body}>
        <View style={styles.loginHeader}>
          <Image
            source={require("./src/assets/images/bigdot_header_logo.png")}
            style={styles.logo_head_icon}
          />
        </View>
        <Image
          source={require("./src/assets/images/img/no_internet.png")}
          style={styles.image_con}
        />
        <HeadingText style={styles.heading_txt}>
          No Internet connectivity
        </HeadingText>
        <Text style={styles.title_txt}>
          You are facing some connectivity issue. Click the button below to try
          again.
        </Text>
        <Pressable style={styles.try_again_btn}>
          <HeadingText style={styles.loginBtnText}>Try Again</HeadingText>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal_body: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 5,
    height: 1,
    backgroundColor: "gray",
    width: "100%",
  },
  logo_head_icon: {
    width: 70,
    height: 28,
    resizeMode: "contain",
  },
  loginHeader: {
    paddingHorizontal: 22,
    paddingVertical: 7,
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    height: 45,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image_con: {
    maxWidth: 300,
    height: 267,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 12,
    marginTop: 26,
  },
  title_txt: {
    fontSize: 13,
    lineHeight: 16,
    textAlign: "center",
    marginTop: 0,
    width: 280,
    marginLeft: "auto",
    marginRight: "auto",
  },
  heading_txt: {
    fontSize: 28,
    marginBottom: 12,
    textAlign: "center",
  },
  try_again_btn: {
    height: 38,
    width: 235,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0db04b",
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 22,
  },
  loginBtnText: {
    fontSize: 12,
    lineHeight: 14,
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
  },
});

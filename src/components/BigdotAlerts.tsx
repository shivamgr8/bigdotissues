import React, { useRef } from "react";
import { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  ImageBackground,
  Dimensions,
  Linking,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "./Themed";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import NetInfo, { useNetInfo } from "@react-native-community/netinfo";
import { AlertContext } from "../../src/hooks/AlertContext";
import { isReachable } from "../utils/utilityFunctions";
import emitter from "../hooks/emitter";
import { useSelector, useDispatch } from "react-redux";
import { updateSourceSlices } from "../services/redux/slices/sourcesSlices";
import { navigate } from "../../RootNavigator";

const sw = Dimensions.get("screen").width;

const BigdotAlerts = () => {
  const colorScheme = useColorScheme();
  // const navigation = useNavigation();
  //const { alert_str, setAlert} = useContext(AlertContext)
  let alert_str: string = "";
  const dispatch = useDispatch();
  const data = useSelector((state: any) => state.sourceSlice.data);
  const [alert_name, setAlertName] = useState("");
  const [sourceName, setSourceName] = useState({
    source: "",
    id: "",
    updatedData: [],
  });
  const [auto_close, setAutoClose] = useState(false);
  const [netInfos, setNetInfos] = useState(false);
  const netInfo = useNetInfo();
  const [isServerReachable, setServerReachable] = useState(true);
  const slideup = useRef(new Animated.Value(0)).current;
  const netSlideUp = useRef(new Animated.Value(0)).current;
  let autohidetime = 6000;
  let timeout_id: any = null;

  const emitListener = (t_alert_name: any) => {
    console.log("---t_alert_name----", t_alert_name);
    if (t_alert_name && t_alert_name.source) {
      showAlert("");
      setSourceName(t_alert_name);
    } else {
      setSourceName({ id: "", source: "", updatedData: [] });
      showAlert(t_alert_name);
    }
  };

  useEffect(() => {
    emitter.addListener("alert", emitListener);
    return () => {
      emitter.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    NetInfo.addEventListener((state) => {
      if (state.isConnected === false) {
        Animated.timing(netSlideUp, {
          toValue: 80,
          duration: 300,
          useNativeDriver: false,
        }).start();
        setNetInfos(true);
      } else {
        setNetInfos(false);
        Animated.timing(netSlideUp, {
          toValue: -200,
          duration: 300,
          useNativeDriver: false,
        }).start(({ finished }) => {});
        isReachable().then((resp) => {
          console.log("----resp---", resp);
          if (resp === false) {
            autohidetime = 3000;
            setAlertName("netconnection");
            setServerReachable(false);
          }
        });
      }
    });
  }, [netInfos, isServerReachable]);

  const showAnim = () => {
    Animated.timing(slideup, {
      toValue: 80,
      duration: 300,
      useNativeDriver: false,
    }).start();
    timeout_id = setTimeout(function () {
      hideAnim();
      autohidetime = 3000; // reset if modified
    }, autohidetime);
  };
  const hideAnim = () => {
    Animated.timing(slideup, {
      toValue: -200,
      duration: 300,
      useNativeDriver: false,
    }).start(({ finished }) => {
      setAlertName("");
    });
    clearTimeout(timeout_id);
  };

  const showAlert = (tname: string) => {
    setAlertName(tname);
    showAnim();
  };

  const handleSettings = () => {
    hideAnim();
    //Linking.openURL('app-settings:')
    // Linking.openSettings();
    Linking.sendIntent("android.settings.WIFI_SETTINGS");
  };

  const navigateToLogin = () => {
    hideAnim();
    navigate("Auth", "Login");
  };

  const undoSource = () => {
    console.log("--sourceName--", sourceName);
    if (sourceName && sourceName.source.length !== 0) {
      let updatedData: any = [...sourceName.updatedData];
      const existingIndex = updatedData.findIndex(
        (item: any) => item.id == sourceName.id
      );
      if (existingIndex !== -1) {
        updatedData[existingIndex] = { id: sourceName.id, undo: true };
      }
      console.log("---updatedData---", updatedData);
      dispatch(updateSourceSlices(updatedData));
    }
    console.log("---sourceName---", sourceName);
    hideAnim();
  };
  const undoBookMark = () => {
    emitter.emit("undobookmark", alert_name);
    hideAnim();
  };
  // useEffect(() => {
  //   setAlertName(props.alert_name)
  //   return () => {  }
  // }, [alert_name])
  /*try{
        isReachable().then((res)=>{
          if(res===false)showAlert('netconnection')
          if(res===true)hideAnim()
        })
      }catch(e:any){console.log(e.message)}
    */

  if (netInfos === true) {
    return (
      <Animated.View
        style={[styles.container_big, { bottom: netSlideUp, height: 80 }]}
      >
        <View style={[styles.offline_cont, { backgroundColor: "#1e1e1e" }]}>
          <Text style={styles.offlineText}>
            You're offline. Please check your internet connection.
          </Text>
          <TouchableOpacity onPress={handleSettings}>
            <Text
              style={[styles.offlineBtn, { color: Colors[colorScheme].tint }]}
            >
              Settings
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  if (alert_name === "samepwd") {
    return (
      <Animated.View style={[styles.container_big, { bottom: slideup }]}>
        <View
          style={[
            styles.anim_cont,
            { backgroundColor: "#1e1e1e", borderRadius: 10 },
          ]}
        >
          <Text style={styles.offlineText}>
            An old password and a new password can't be the same.
          </Text>
          <TouchableOpacity onPress={hideAnim}>
            <Text
              style={[styles.offlineBtn, { color: Colors[colorScheme].tint }]}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  if (alert_name == "copys") {
    return (
      <Animated.View style={[styles.container, { bottom: slideup }]}>
        <View style={[styles.anim_cont, { backgroundColor: "#0db04b" }]}>
          <Text style={styles.alertText}>Copied to clipboard.</Text>
          <TouchableOpacity onPress={hideAnim}>
            <Text
              style={[styles.alertBtn, { color: Colors[colorScheme].barBg }]}
            >
              close
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  if (alert_name == "logoutSuccess") {
    return (
      <Animated.View style={[styles.container, { bottom: slideup }]}>
        <View style={[styles.anim_cont, { backgroundColor: "#0db04b" }]}>
          <Text style={styles.alertText}>
            You have been successfully logged out!
          </Text>
          <TouchableOpacity onPress={hideAnim}>
            <Text
              style={[styles.alertBtn, { color: Colors[colorScheme].barBg }]}
            >
              close
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }
  if (alert_name == "logoutError") {
    return (
      <Animated.View style={[styles.container, { bottom: slideup }]}>
        <View style={[styles.anim_cont, { backgroundColor: "#0db04b" }]}>
          <Text style={styles.alertText}>Error while logout.</Text>
          <TouchableOpacity onPress={hideAnim}>
            <Text
              style={[styles.alertBtn, { color: Colors[colorScheme].barBg }]}
            >
              close
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }
  if (alert_name == "emailupdated") {
    return (
      <Animated.View style={[styles.container, { bottom: slideup }]}>
        <View style={[styles.anim_cont, { backgroundColor: "#0db04b" }]}>
          <Text style={styles.alertText}>Email Address Updated.</Text>
          <TouchableOpacity onPress={hideAnim}>
            <Text
              style={[styles.alertBtn, { color: Colors[colorScheme].barBg }]}
            >
              close
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }
  if (alert_name == "phoneupdated") {
    return (
      <Animated.View style={[styles.container, { bottom: slideup }]}>
        <View style={[styles.anim_cont, { backgroundColor: "#0db04b" }]}>
          <Text style={styles.alertText}>Phone Number Updated.</Text>
          <TouchableOpacity onPress={hideAnim}>
            <Text
              style={[styles.alertBtn, { color: Colors[colorScheme].barBg }]}
            >
              close
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }
  if (alert_name == "pwdchange") {
    return (
      <Animated.View style={[styles.container, { bottom: slideup }]}>
        <View style={[styles.anim_cont, { backgroundColor: "#0db04b" }]}>
          <Text style={styles.alertText}>Password changed successfully.</Text>
          <TouchableOpacity onPress={hideAnim}>
            <Text
              style={[styles.alertBtn, { color: Colors[colorScheme].barBg }]}
            >
              close
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }
  if (alert_name == "profileupdated") {
    return (
      <Animated.View style={[styles.container, { bottom: slideup }]}>
        <View style={[styles.anim_cont, { backgroundColor: "#0db04b" }]}>
          <Text style={styles.alertText}>Profile updated</Text>
          <TouchableOpacity onPress={hideAnim}>
            <Text
              style={[styles.alertBtn, { color: Colors[colorScheme].barBg }]}
            >
              close
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  if (sourceName && sourceName.source && sourceName.source.length !== 0) {
    return (
      <Animated.View style={[styles.container, { bottom: slideup }]}>
        <View style={[styles.anim_cont, { backgroundColor: "#0db04b" }]}>
          <Text style={styles.alertText}>{sourceName.source} Muted</Text>
          <TouchableOpacity onPress={undoSource}>
            <Text
              style={[styles.alertBtn, { color: Colors[colorScheme].barBg }]}
            >
              UNDO
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  if (alert_name == "login_error") {
    return (
      <Animated.View style={[styles.container, { bottom: slideup }]}>
        <View style={[styles.anim_cont, { backgroundColor: "#0db04b" }]}>
          <Text style={styles.alertText}>Login error. Please try later</Text>
          <TouchableOpacity onPress={hideAnim}>
            <Text
              style={[styles.alertBtn, { color: Colors[colorScheme].barBg }]}
            >
              close
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  if (alert_name == "asklogin") {
    return (
      <Animated.View style={[styles.container, { bottom: slideup }]}>
        <View style={[styles.anim_cont, { backgroundColor: "#0db04b" }]}>
          <Text style={styles.alertText}>
            You need to login to save bookmarks.
          </Text>
          <TouchableOpacity onPress={hideAnim}>
            <Text
              style={[styles.alertBtn, { color: Colors[colorScheme].barBg }]}
            >
              close
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  if (alert_name == "cate_alert") {
    return (
      <Animated.View style={[styles.container_big, { bottom: slideup }]}>
        <View style={[styles.offline_cont, { backgroundColor: "#1e1e1e" }]}>
          <Text style={styles.offlineText}>
            You need to sign in to use this feature.
          </Text>
          <TouchableOpacity onPress={navigateToLogin}>
            <Text
              style={[
                styles.offlineBtn,
                { color: Colors["light"].tabIconDefault },
              ]}
            >
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  if (alert_name == "saved" || alert_name.split(",")[2] == "saved") {
    return (
      <Animated.View style={[styles.container, { bottom: slideup }]}>
        <View style={[styles.anim_cont, { backgroundColor: "#0db04b" }]}>
          <Text style={styles.alertText}>Added to saved stories.</Text>
          <TouchableOpacity onPress={undoBookMark}>
            <Text
              style={[styles.alertBtn, { color: Colors[colorScheme].barBg }]}
            >
              undo
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  if (alert_name == "removedBookmark") {
    return (
      <Animated.View style={[styles.container, { bottom: slideup }]}>
        <View style={[styles.anim_cont, { backgroundColor: "#0db04b" }]}>
          <Text style={styles.alertText}>Removed From saved stories.</Text>
          <TouchableOpacity onPress={hideAnim}>
            <Text
              style={[styles.alertBtn, { color: Colors[colorScheme].barBg }]}
            >
              close
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  if (alert_name == "Somethingwrong") {
    return (
      <Animated.View style={[styles.container, { bottom: slideup }]}>
        <View style={[styles.anim_cont, { backgroundColor: "#0db04b" }]}>
          <Text style={styles.alertText}>Somethig went wrong.</Text>
          <TouchableOpacity onPress={hideAnim}>
            <Text
              style={[styles.alertBtn, { color: Colors[colorScheme].barBg }]}
            >
              close
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }
  if (alert_name == "sharingErr") {
    return (
      <Animated.View style={[styles.container, { bottom: slideup }]}>
        <View style={[styles.anim_cont, { backgroundColor: "#0db04b" }]}>
          <Text style={styles.alertText}>Error while sharing.</Text>
          <TouchableOpacity onPress={hideAnim}>
            <Text
              style={[styles.alertBtn, { color: Colors[colorScheme].barBg }]}
            >
              close
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  if (alert_name == "updatingnews") {
    return (
      <View style={styles.updatingNewsBox}>
        <View style={styles.updatingNewsChild}>
          <Text style={styles.updatingNewsTitle}>
            Updating with the latest news{" "}
          </Text>
          <Image
            source={require("../assets/images/img/rolling.gif")}
            style={styles.updatingnewsGif}
          />
        </View>
      </View>
    );
  }

  if (alert_name == "passError") {
    return (
      <Animated.View style={[styles.container, { bottom: slideup }]}>
        <View style={[styles.anim_cont, { backgroundColor: "#0db04b" }]}>
          <Text style={styles.alertText}>Error while update password.</Text>
          <TouchableOpacity onPress={hideAnim}>
            <Text
              style={[styles.alertBtn, { color: Colors[colorScheme].barBg }]}
            >
              close
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }
  if (alert_name == "fpwdErr") {
    return (
      <Animated.View style={[styles.container, { bottom: slideup }]}>
        <View style={[styles.anim_cont, { backgroundColor: "#0db04b" }]}>
          <Text style={styles.alertText}>Error while forgot password.</Text>
          <TouchableOpacity onPress={hideAnim}>
            <Text
              style={[styles.alertBtn, { color: Colors[colorScheme].barBg }]}
            >
              close
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }
  if (alert_name == "otpErr") {
    return (
      <Animated.View style={[styles.container, { bottom: slideup }]}>
        <View style={[styles.anim_cont, { backgroundColor: "#0db04b" }]}>
          <Text style={styles.alertText}>Something went wrong.</Text>
          <TouchableOpacity onPress={hideAnim}>
            <Text
              style={[styles.alertBtn, { color: Colors[colorScheme].barBg }]}
            >
              close
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }
  if (alert_name == "pwdset") {
    return (
      <Animated.View style={[styles.container, { bottom: slideup }]}>
        <View style={[styles.anim_cont, { backgroundColor: "#0db04b" }]}>
          <Text style={styles.alertText}>Password set successfully.</Text>
          <TouchableOpacity onPress={hideAnim}>
            <Text
              style={[styles.alertBtn, { color: Colors[colorScheme].barBg }]}
            >
              close
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }
  if (alert_name == "pwdReset") {
    return (
      <Animated.View style={[styles.container, { bottom: slideup }]}>
        <View style={[styles.anim_cont, { backgroundColor: "#0db04b" }]}>
          <Text style={styles.alertText}>Password reset successfully..</Text>
          <TouchableOpacity onPress={hideAnim}>
            <Text
              style={[styles.alertBtn, { color: Colors[colorScheme].barBg }]}
            >
              close
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  }

  if (alert_name == "googleLoader") {
    return (
      <View style={styles.googleLoaderBox}>
        <View style={styles.googleLoaderChild}>
          <Image
            source={require("../assets/images/img/rolling.gif")}
            style={styles.googleGif}
          />
        </View>
      </View>
    );
  }

  return <View></View>;
};
export default BigdotAlerts;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: sw,
    left: 0,
    // height: 42,
    zIndex: 999,
    //backgroundColor:"#ff00ff"
  },
  container_big: {
    position: "absolute",
    width: sw,
    left: 0,
    zIndex: 999,
    //backgroundColor:"#ff00ff"
  },
  anim_cont: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 14,
    borderRadius: 50,
    marginHorizontal: 22,
    shadowColor: "#000000",
    display: "flex",
    // justifyContent: "space-between",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  alertText: {
    fontSize: 12,
    lineHeight: 14,
    fontFamily: "Poppins-Medium",
    color: "#fff",
    letterSpacing: 0.21,
    flex: 2,
  },
  alertBtn: {
    textTransform: "uppercase",
    fontSize: 12,
    lineHeight: 14,
    fontFamily: "Poppins-Medium",
    color: "#fff",
    letterSpacing: 0.21,
    textAlignVertical: "center",
    opacity: 0.7,
    marginLeft: 25,
    flex: 1,
  },
  offline_cont: {
    paddingHorizontal: 20,
    paddingTop: 17,
    paddingBottom: 17,
    borderRadius: 10,
    marginHorizontal: 22,
    shadowColor: "#000000",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  offlineText: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "Poppins-Medium",
    color: "#fff",
    letterSpacing: 0.21,
    flexBasis: "70%",
  },
  offlineBtn: {
    textTransform: "uppercase",
    fontSize: 12,
    lineHeight: 14,
    fontFamily: "Poppins-Medium",
    color: "#fff",
    letterSpacing: 0.21,
    opacity: 0.7,
    marginLeft: 25,
  },
  updatingNewsBox: {
    position: "absolute",
    top: 135,
    width: "100%",
    margin: "auto",
    textAlign: "center",
    borderRadius: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  updatingNewsChild: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 50,
    width: 245,
    height: 42,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  updatingNewsTitle: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Poppins-Medium",
    color: "#333333",
    letterSpacing: 0.21,
  },
  googleLoaderBox: {
    position: "absolute",
    top: 135,
    width: "100%",
    margin: "auto",
    textAlign: "center",
    borderRadius: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  googleLoaderChild: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 50,
    width: 38,
    height: 38,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  updatingnewsGif: {
    width: 18,
    height: 18,
    marginLeft: 8,
  },
  googleGif: {
    width: 24,
    height: 24,
  },
});

import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { View } from "../components/Themed";
import ImageTabBarIcon from "../components/ImageTabBarIcon";

const { width } = Dimensions.get("screen");

interface CustomHeaderProps {
  navigation: any;
}

const CustomHeader = ({ navigation }: CustomHeaderProps) => {
  return (
    <View style={[styles.customHeader]}>
      <TouchableOpacity
        onPress={() => navigation.toggleDrawer()}
        activeOpacity={0.7}
      >
        <ImageTabBarIcon
          myasset_name="drawericon"
          focused={false}
          style={styles.toggleIcon}
        />
      </TouchableOpacity>
      <View style={{ marginLeft: "auto", marginRight: "auto" }}>
        <ImageTabBarIcon
          myasset_name="headerlogo"
          focused={false}
          style={styles.logoHeader}
        />
      </View>
      <View style={styles.bellCont}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("BigdotAlertScreen");
          }}
        >
          <ImageTabBarIcon
            myasset_name="bellIcon"
            focused={false}
            style={styles.bellImg}
          />
          <View style={styles.bellDot}></View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  customHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  bigdot: {
    width: 32,
    height: 32,
  },
  topHeaderBar: {
    borderBottomWidth: 0.5,
    paddingVertical: 9,
    paddingLeft: 22,
    paddingRight: 18,
  },
  toggleIcon: {
    width: 17,
    height: 17,
    marginRight: 0,
  },
  logoHeader: {
    width: 70,
    height: 28,
    alignSelf: "center",
    resizeMode: "contain",
  },
  tabBarStyle: {
    backgroundColor: "red",
  },
  bell: {
    fontSize: 20,
    paddingTop: 4,
    position: "relative",
  },
  bellImg: {
    width: 20,
    height: 20,
  },
  bellDot: {
    width: 8,
    height: 8,
    borderRadius: 50,
    backgroundColor: "#0db04b",
    position: "absolute",
    top: 3,
    right: 1,
  },
  closeIcon: {
    width: 15,
    height: 15,
    resizeMode: "cover",
  },
  settingIcon: {
    width: 18,
    height: 18,
    resizeMode: "cover",
  },
  bellCont: {
    ...Platform.select({
      ios: {
        paddingRight: 10,
      },
      android: {
        paddingRight: 0,
      },
      default: {
        paddingRight: 10,
      },
    }),
  },
});

export default CustomHeader;

import React from "react";
import { Text, View } from "../Themed";
import { StyleSheet, TouchableOpacity } from "react-native";
import ImageTabBarIcon from "../../components/ImageTabBarIcon";
import usePrefetchTheme from "../../hooks/usePrefetchTheme";
import useColorScheme from "../../hooks/useColorScheme";

export default function BackFooter(props: { backHandler: any }) {
  let theme = usePrefetchTheme();
  const colorSchema = useColorScheme();
  if (theme !== "dark" && theme !== "light") {
    theme = colorSchema;
  }
  const handleBack = () => {
    props.backHandler();
  };

  return (
    <>
      <View
        style={[
          styles.singleFooterParent,
          {
            borderTopColor: theme === "dark" ? "#2a2a2a" : "#e2e2e280",
          },
        ]}
        className="flex-row items-center justify-between flex-1"
      >
        <View style={styles.singleFooterLeft} className="">
          <TouchableOpacity
            onPress={handleBack}
            style={{
              width: 44,
              height: "100%",
              justifyContent: "center",
            }}
          >
            <ImageTabBarIcon
              myasset_name="singleArrow"
              focused={false}
              style={styles.singleArrow}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  singleFooterParent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    paddingHorizontal: 24,
    // paddingVertical: 17.5,
    height: 56,
    borderTopWidth: 1,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowColor: "#000",
    elevation: 9,
  },
  singleFooterLeft: {},
  singleArrow: {
    width: 20,
    height: 20,
  },
});

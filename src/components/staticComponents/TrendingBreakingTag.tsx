import React from "react";
import { Text, View } from "../Themed";
import { StyleSheet, TouchableOpacity, Image, Pressable } from "react-native";

export default function TrendingBreakingTag(props: { tagname: String }) {
  return (
    <View className="flex items-center flex-row" style={styles.tagParent}>
      <Pressable className="flex items-center flex-row">
        {props.tagname == "video" ? (
          <Image
            source={require("../../assets/images/img/video-inside.png")}
            style={styles.trendingIcon}
          />
        ) : props.tagname == "trending" ? (
          <Image
            source={require("../../assets/images/img/trending_icon.png")}
            style={styles.trendingIcon}
          />
        ) : props.tagname == "breaking" ? (
          <Image
            source={require("../../assets/images/img/breaking_icon.png")}
            style={styles.trendingIcon}
          />
        ) : (
          <Image
            source={require("../../assets/images/img/topstory_icon.png")}
            style={[styles.trendingIcon, { marginTop: -4 }]}
          />
        )}
        <Text style={styles.trendingText}>{props.tagname}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tagParent: {
    marginBottom: 11,
  },
  trendingText: {
    fontSize: 10,
    color: "#0db04b",
    lineHeight: 12,
    letterSpacing: 0,
    marginRight: 12,
    textTransform: "uppercase",
    fontFamily: "Poppins-SemiBold",
  },
  trendingIcon: {
    width: 15,
    height: 15,
    marginRight: 3,
  },
});

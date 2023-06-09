import React from "react";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import { HeadingText, Text, View } from "../Themed";
import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/native";
import ImageTabBarIcon from "../../components/ImageTabBarIcon";
import usePrefetchTheme from "../../hooks/usePrefetchTheme";

export default function ButtonRecent(props: { slug: string; title: string }) {
  const navigation = useNavigation();
  let theme = usePrefetchTheme();
  if (theme !== "dark" && theme !== "light") {
    theme = useColorScheme();
  }
  const colorScheme = useColorScheme();
  const screenpath = props.slug
    .toLowerCase()
    .replace(/ /g, "")
    .replace(/[^\w-]+/g, "");

  const handlePress = () => {
    const screenpath: any = props.title
      .toLowerCase()
      .replace(/ /g, "")
      .replace(/[^\w-]+/g, "");
    navigation.navigate(screenpath);
    //console.log(screenpath)
  };

  return (
    <View className="flex-row">
      <Pressable
        onPress={handlePress}
        className="flex-row items-center"
        style={styles.buttonRecentBox}
      >
        {/* <MaterialIcons className='self-center' name="history" size={20} color={Colors[colorScheme].text} style={styles.icon}/> */}
        <ImageTabBarIcon
          myasset_name="recentbtnicon"
          focused={false}
          style={styles.icon}
        />
        <Text style={[styles.text, { color: Colors[theme].headingtext }]}>
          {props.title}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRecentBox: {
    minWidth: 20,
    minHeight: 10,
    borderWidth: 1,
    borderColor: "#0db04b",
    borderRadius: 50,
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  icon: {
    marginRight: 5,
    width: 13,
    height: 13,
    resizeMode: "cover",
  },
  text: {
    fontSize: 12,
    lineHeight: 16,
  },
});

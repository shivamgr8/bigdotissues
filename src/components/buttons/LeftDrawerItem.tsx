import React from "react";
import {
  FontAwesome,
  Ionicons,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";
import { HeadingText, Text, View, Pressable } from "../Themed";
import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/native";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
} from "react-native";

export default function LeftDrawerItem(props: any) {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const handlePress = () => {
    const screenpath = props.title
      .toLowerCase()
      .replace(/ /g, "")
      .replace(/[^\w-]+/g, "");
    navigation.navigate(screenpath);
    //console.log(screenpath)
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.nav_btn}>
      <HeadingText style={{ fontSize: 18 }}>{props.title}</HeadingText>
      {/* <Entypo
        name="chevron-small-right"
        size={25}
        color={Colors[colorScheme].text}
      /> */}
      <Image source={require("../../assets/images/img/sidemenu_arrow.png")} style={{width:12, height:12, marginTop:-1, marginRight:3}} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  nav_btn: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginRight: -8,
    marginBottom: 26,
  },
});

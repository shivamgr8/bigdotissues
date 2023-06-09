import * as React from "react";
import { StatusBar } from "react-native";
import { View } from "../../components/Themed";
import gstyles from "../../assets/styles/styles";
import PostsList from "../newsPosts/postsList/PostsList";
import { useNavigation } from "@react-navigation/native";
import usePrefetchTheme from "../../hooks/usePrefetchTheme";
import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";

export default function CategoryScreen(props: any) {
  //console.log(CategoryScreen.name+">> Cate ID:"+JSON.stringify(props.route.params.CateId))
  const navigation = useNavigation();
  let theme = usePrefetchTheme();
  const colorScheme = useColorScheme();
  if (theme !== "light" && theme !== "dark") {
    theme = colorScheme;
  }

  return (
    <View style={gstyles.container}>
      <StatusBar
        translucent={false}
        backgroundColor={Colors[theme].background}
        barStyle={theme === "dark" ? "light-content" : "dark-content"}
      />
      <PostsList cate_id={props.route.params.CateId} />
    </View>
  );
}

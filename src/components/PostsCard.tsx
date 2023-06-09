import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useContext, useState } from "react";
import {
  StyleSheet,
  Image,
  Animated,
  Pressable,
  TouchableWithoutFeedback,
  Share,
} from "react-native";
import { Text, View, HeadingText } from "./Themed";
import { useNavigation } from "@react-navigation/native";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import ImageTabBarIcon from "./ImageTabBarIcon";
import { AuthContext } from "../hooks/AuthContext";
import { itemType } from "../../types";
import emitter from "../hooks/emitter";
import TrendingBreakingTag from "../components/staticComponents/TrendingBreakingTag";
import usePrefetchTheme from "../hooks/usePrefetchTheme";
import { api_updateBookmarkOnline } from "../services/network/apiServices";
import { onShareHandler } from "../utils/utilityFunctions";
import { AppConsolelog } from "../utils/commonFunctions";
import { stopAudio } from "../services/redux/slices/AudioSlice";
import { useDispatch } from "react-redux";

interface indexType {
  pindex: number;
  color: string;
}

interface PostsCardProps {
  tcolor: any;
  item: itemType;
  myindex?: any;
  postdata: any;
  is_bookmark?: any;
  showIndex?: boolean;
  postDataRef: any;
  moreforyou: boolean;
  showTags?: boolean;
  onEllipsisPress?: any;
  onToggleBookmark: () => void;
}

const PostsCard = (props: PostsCardProps) => {
  const authContext = useContext(AuthContext);
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const colorScheme = useColorScheme();
  let theme = usePrefetchTheme();
  if (theme !== "dark" && theme !== "light") {
    theme = colorScheme;
  }
  const [item, setItem] = useState<itemType | null>(props.item);
  const [imageAspectRatio, setImageAspectRatio] = useState(1);
  const animatedButtonScale = new Animated.Value(1);

  //-----------------------start: bookmark------------------------

  // const onToggleBookmark = () => {
  //   if (authContext.getUserData !== false) {
  //     try {
  //       const temp = [...props.postdata];
  //       if (temp[props.myindex].is_bookmark === true) {
  //         temp[props.myindex].is_bookmark = false;
  //         api_updateBookmarkOnline(
  //           authContext.getUserData,
  //           props.item.id,
  //           "delete"
  //         );
  //       } else {
  //         temp[props.myindex].is_bookmark = true;
  //         api_updateBookmarkOnline(
  //           authContext.getUserData,
  //           props.item.id,
  //           "save"
  //         ).then((res) => {
  //           if (res && res.status === "success") {
  //             emitter.emit("alert", `${props.myindex},${props.item.id},saved`);
  //           }
  //         });
  //       }
  //       props.setData(temp);
  //       emitter.addListener("undobookmark", (eventData: string) => {
  //         try {
  //           console.log("hhhhhh", eventData);
  //           const temp = [...props.postdata];
  //           if (
  //             temp[parseInt(eventData?.split(",")[0], 10)].is_bookmark === true
  //           ) {
  //             temp[parseInt(eventData?.split(",")[0], 10)].is_bookmark = false;
  //             AppConsolelog(
  //               "--temp[eventData].id--",
  //               temp[parseInt(eventData?.split(",")[0], 10)].id
  //             );
  //             api_updateBookmarkOnline(
  //               authContext.getUserData,
  //               eventData?.split(",")[1],
  //               "delete"
  //             );
  //           }
  //           props.setData(temp);
  //         } catch (error) {
  //           AppConsolelog("--errorWhileUndoSave--", error);
  //         }
  //       });
  //     } catch (error) {
  //       AppConsolelog("---errorWhileSavePost--", error);
  //     }
  //   } else {
  //     emitter.emit("alert", "cate_alert");
  //   }
  // };

  // Initial scale value of 1 means no scale applied initially.
  // When button is pressed in, animate the scale to 1.5
  const onPressIn = () => {
    Animated.spring(animatedButtonScale, {
      toValue: 1.1,
      useNativeDriver: true,
    }).start();
  };

  // When button is pressed out, animate the scale back to 1
  const onPressOut = () => {
    Animated.spring(animatedButtonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // The animated style for scaling the button within the Animated.View
  const animatedScaleStyle = {
    transform: [{ scale: animatedButtonScale }],
  };
  //-----------------------end: bookmark------------------------

  //------------------------start: share------------------------
  const shareLink = async () => {
    const items = {
      itemId: item?.id,
      itemTitle: item?.title.trim(),
      itemDescription: item?.description.slice(0, 10),
      itemImage: item?.images[0]?.url,
    };
    let shareUrl;
    try {
      shareUrl = await onShareHandler(items);
      console.log("---shareUrl---", shareUrl);
    } catch (error) {
      console.log("--shareError--", error);
    }
    try {
      if (shareUrl !== undefined) {
        await Share.share({
          message: `${shareUrl}`,
        });
      }
    } catch (error) {
      emitter.emit("alert", "sharingErr");
    }
  };
  //------------------------end: share------------------------

  const getImageSize = (imageUrl: string) => {
    if (imageUrl) {
      return Image.getSize(imageUrl, (width, height) => {
        const aspectRation = width / height;
        // console.log(
        //   width,
        //   "--Width--height--",
        //   height,
        //   "--aspectRatio--",
        //   aspectRation
        // );
        setImageAspectRatio(aspectRation);
      });
    }
    setImageAspectRatio(1);
  };

  if (item != null) {
    getImageSize(item?.image_url);
    return (
      <View
        style={[
          styles.gridBox,
          {
            borderBottomColor: Colors[theme].shadowColor,
          },
        ]}
      >
        <Pressable
          onPress={() => {
            dispatch(stopAudio());
            return navigation.push("PostsDetailList", {
              cate_id: item.categoryId,
              index: props.myindex,
              postdata: props.postdata,
              postDataRef: props.postDataRef,
            });
          }}
        >
          <View>
            {props.myindex !== 0 && (
              <>
                {props.showTags && (
                  <View
                    className="flex items-center flex-row"
                    style={{ marginBottom: 3 }}
                  >
                    {item.is_video ? (
                      <TrendingBreakingTag tagname="video" />
                    ) : null}
                    {item.is_breaking ? (
                      <TrendingBreakingTag tagname="breaking" />
                    ) : null}
                    {item.is_top_story ? (
                      <TrendingBreakingTag tagname="top story" />
                    ) : null}
                    {item.is_trending ? (
                      <TrendingBreakingTag tagname="trending" />
                    ) : null}
                  </View>
                )}
              </>
            )}
            <View
              className="justify-between items-start"
              style={{
                marginBottom: 18,
                flexDirection:
                  props.myindex == 0 && props.moreforyou == false
                    ? "column-reverse"
                    : "row",
                marginTop:
                  props.myindex == 0 && props.moreforyou == false ? 2 : 0,
              }}
            >
              <HeadingText style={styles.title}>
                {props.tcolor !== null && (
                  <HeadingText style={{ color: props.tcolor }}>
                    {props.myindex + 1}.{" "}
                  </HeadingText>
                )}
                {item.title.trim()}
              </HeadingText>
              {props.myindex == 0 && props.moreforyou == false && (
                <View
                  className="flex items-center flex-row"
                  style={{
                    marginTop: 14,
                    marginBottom: 4,
                  }}
                >
                  {item.is_video ? (
                    <TrendingBreakingTag tagname="video" />
                  ) : null}
                  {item.is_breaking ? (
                    <TrendingBreakingTag tagname="breaking" />
                  ) : null}
                  {item.is_top_story ? (
                    <TrendingBreakingTag tagname="top story" />
                  ) : null}
                  {item.is_trending ? (
                    <TrendingBreakingTag tagname="trending" />
                  ) : null}
                </View>
              )}
              {item.images && item?.images.length && item?.images[0]?.url ? (
                <>
                  <Image
                    source={{ uri: item?.images[0]?.url }}
                    style={
                      props.myindex == 0 && props.moreforyou == false
                        ? styles.story_hour_image
                        : [styles.fimage, { aspectRatio: imageAspectRatio }]
                    }
                  />
                  {item && item.story_of_the_hour === true && (
                    <Text style={styles.storyoftheyear}>Story of the Hour</Text>
                  )}
                </>
              ) : null}
            </View>
            <View className="w-100">
              <Text style={styles.shortlines} numberOfLines={3}>
                {item.short_description.trim()}
              </Text>
            </View>
          </View>
        </Pressable>
        <View style={styles.contentLR} className="items-center">
          <View style={styles.vcenter}>
            <View className="flex-row" style={{ marginTop: 1 }}>
              <Pressable
                onPress={() =>
                  navigation.navigate("SourceListScreen", {
                    sourceId: item.sourceId,
                    sourceLogo: item.logo,
                  })
                }
                style={{ flexDirection: "row" }}
              >
                {item.icon ? (
                  <Image source={{ uri: item?.icon }} style={styles.mintLogo} />
                ) : null}
                <HeadingText
                  style={styles.sourcesText}
                  className="px-1 self-center"
                >
                  {item.source}
                </HeadingText>
              </Pressable>

              <FontAwesome
                name="circle"
                size={4}
                color={Colors[colorScheme].text}
                style={styles.circleFontIcon}
              />
              <HeadingText style={styles.pubDate} className="px-1 self-center">
                {item.timeAgo && `${item.timeAgo}`}
              </HeadingText>
            </View>
          </View>
          <View className="flex-row items-center">
            <TouchableWithoutFeedback
              onPress={props.onToggleBookmark}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
            >
              <Animated.View style={animatedScaleStyle}>
                <ImageTabBarIcon
                  myasset_name={
                    theme === "dark" ? "singleShortlistdark" : "singleShortlist"
                  }
                  focused={item.is_bookmark === true ? true : false}
                  style={styles.singleShortlist}
                />
              </Animated.View>
              {/* <AnimatedLottieView
                autoPlay
                style={{
                  width: 20,
                  height: 20,
                  marginRight: 17,
                  borderWidth: 1,
                }}
                source={require("../assets/images/bookmark.json")}
              /> */}
            </TouchableWithoutFeedback>
            <Pressable
              onPress={shareLink}
              style={{ marginRight: 0, paddingTop: -5, paddingLeft: 0 }}
            >
              <ImageTabBarIcon
                myasset_name="singleForward"
                focused={false}
                style={[
                  styles.singleForward,
                  { marginRight: !props.showTags ? 11 : 0 },
                ]}
              />
            </Pressable>
            {!props.showTags && (
              <Pressable onPress={() => props.onEllipsisPress(item.id)}>
                <ImageTabBarIcon
                  myasset_name="historyTtripleDot"
                  style={{
                    width: 7,
                    height: 18,
                    resizeMode: "contain",
                    padding: 7,
                  }}
                />
              </Pressable>
            )}
          </View>
        </View>
      </View>
    );
  } else {
    return <View></View>;
  }
};

export default PostsCard;

const styles = StyleSheet.create({
  gridBox: {
    borderBottomWidth: 0.5,
    paddingTop: 18,
    paddingBottom: 19,
    paddingHorizontal: 22,
  },
  storyoftheyear: {
    position: "absolute",
    top: 0,
    right: 0,
    borderRadius: 10,
    fontSize: 10,
    lineHeight: 14,
    fontFamily: "Poppins-Medium",
    color: "#fff",
    backgroundColor: "#0db04b",
    width: 110,
    height: 23,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 0,
    paddingVertical: 5,
    textAlign: "center",
  },
  story_hour_image: {
    flex: 1,
    borderRadius: 10,
    minWidth: "100%",
    height: 200,
    resizeMode: "contain",
  },
  fimage: {
    flex: 1,
    borderRadius: 10,
    minWidth: 80,
    // height: 84,
    marginLeft: 20,
    // resizeMode: "contain",
  },
  title: {
    flex: 3,
    // fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.5,
    marginBottom: -10,
    //height:84,
    //overflow:'hidden'
    //minHeight: 100
  },
  contentLR: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 0,
  },
  vcenter: {
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  shortlines: {
    marginBottom: 17,
    fontSize: 12,
    lineHeight: 15,
  },
  mintLogo: {
    width: 20,
    height: 20,
    marginRight: 3,
    borderRadius: 5,
    marginTop: -2,
  },
  sourcesText: {
    fontSize: 10,
    // color: "#4d4d4d",
    textTransform: "uppercase",
    marginTop: 1,
    fontFamily: "Poppins-Regular",
  },
  circleFontIcon: {
    marginRight: 10,
    marginLeft: 10,
    marginTop: -1.5,
    paddingTop: 0,
    color: "#A7A7A7",
    display: "flex",
    alignSelf: "center",
  },
  pubDate: {
    fontSize: 10,
    // color: "#4d4d4d",
    fontFamily: "Poppins-Regular",
  },
  singleShortlist: {
    width: 20,
    height: 20,
    marginRight: 18,
    resizeMode: "contain",
  },
  singleForward: {
    width: 20,
    height: 20,
    marginLeft: 0,
    resizeMode: "contain",
  },
});

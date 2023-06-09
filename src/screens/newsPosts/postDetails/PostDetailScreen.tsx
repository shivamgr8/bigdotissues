import * as React from "react";
import { useContext, useEffect, useState, memo } from "react";
import {
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableNativeFeedback,
  BackHandler,
  Pressable,
  ActivityIndicator,
  StatusBar,
  FlatList,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../../../hooks/AuthContext";
import { Text, View, HeadingText } from "../../../components/Themed";
import RenderHtml, {
  HTMLElementModel,
  HTMLContentModel,
  defaultSystemFonts,
} from "react-native-render-html";
import { onPlayAudio, onToggleBookMark } from "../../../utils/utilityFunctions";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import PostsCard from "../../../components/PostsCard";
import {
  api_more_for_you,
  getPostAudio,
} from "../../../services/network/apiServices";
import { itemType } from "../../../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../../services/redux/store/store";
import SingleImageModal from "../../../components/staticComponents/SingleImageModal";
import Colors from "../../../constants/Colors";
import usePrefetchTheme from "../../../hooks/usePrefetchTheme";
import useColorScheme from "../../../hooks/useColorScheme";
import { AppConsolelog } from "../../../utils/commonFunctions";
import { updateAudioSlice } from "../../../services/redux/slices/AudioSlice";
import { useDispatch } from "react-redux";
import IframeRenderer, { iframeModel } from "@native-html/iframe-plugin";
import WebView, { WebViewMessageEvent } from "react-native-webview";
import { FontAwesome } from "@expo/vector-icons";
import { updateBookMarkPosts } from "../../../services/redux/slices/bookmarksPosts";
import emitter from "../../../hooks/emitter";
import makeWebshell, {
  HandleLinkPressFeature,
  HandleHTMLDimensionsFeature,
  HandleHashChangeFeature,
  ForceElementSizeFeature,
  ForceResponsiveViewportFeature,
  useAutoheight,
} from "@formidable-webview/webshell";
import type {
  HTMLDimensions,
  LinkPressTarget,
  DOMRectSize,
} from "@formidable-webview/webshell";

const Webshell = makeWebshell(
  WebView,
  new HandleHTMLDimensionsFeature(),
  new ForceResponsiveViewportFeature({ maxScale: 1 }),
  new ForceElementSizeFeature({
    target: "body",
    heightValue: "auto",
    widthValue: "auto",
  })
);

const renderers = {
  iframe: IframeRenderer,
};

// const customHTMLElementModels = {
//   iframe: iframeModel,
// };
const height = (Dimensions.get("window").width / 16) * 9;
let fw = Dimensions.get("screen").width;
let fh = Dimensions.get("screen").height;
let sw = fw - 16;

const PostDetailScreen = (props: any) => {
  const authContext = useContext(AuthContext);
  const storeSlice: any = useSelector((state: RootState) => state.storeSlice);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const audioState = useSelector((state: any) => state.audioSlice.data);
  const runBeforeFirst = `
  window.isNativeApp = true;
  true; // note: this is required, or you'll sometimes get silent failures
`;
  const width = fw - 44;
  const colorScheme = useColorScheme();
  let theme = usePrefetchTheme();
  if (theme !== "light" && theme !== "dark") {
    theme = colorScheme;
  }

  const [postId, setPostId] = useState(props.index);
  const [myItem, setMyItem] = useState<itemType>(props.item);
  const systemFonts = [...defaultSystemFonts, "Poppins-Regular"];
  const [sliderModal, setSliderModal] = useState(false);
  const [postData, setData] = useState<any>([]);
  const [audioLoading, setAudioLoading] = useState({
    initialLoad: false,
    endLoad: false,
  });
  const [webViewHeight, setWebviewHeight] = useState(fh);
  const webViewRef = React.useRef(null);

  let postDataRef = React.useRef<any>(null);

  const sliderHandler = () => {
    setSliderModal(!sliderModal);
  };

  //----start: onAudioPlay-----
  const onPlay = async () => {
    try {
      setAudioLoading({ initialLoad: true, endLoad: true });
      getPostAudio(props.item.id).then(async (res: any) => {
        if (res.status === "success") {
          AppConsolelog("--AudioRes--", audioState);
          setAudioLoading({ initialLoad: false, endLoad: true });
          if (audioState.soundObj === null) {
            const playbackObj = new Audio.Sound();
            const status = await onPlayAudio(playbackObj, res.mp3);
            setAudioLoading({ initialLoad: false, endLoad: false });
            return dispatch(
              updateAudioSlice({
                playbackObj: playbackObj,
                soundObj: status,
              })
            );
          }
        }
      });
    } catch (error) {
      AppConsolelog("--error--", error);
    }
  };
  //----End: onAudioPlay-----

  const handleBack = () => {
    navigation.goBack();
  };

  const fetchMoreForYou = async () => {
    try {
      const response = await api_more_for_you(postId);
      if (response && response.data.length) {
        setData(response.data);
      }
    } catch (error) {
      AppConsolelog("--fetchMoreForYouError---", error);
    }
  };

  const onToggleBookmark = (item: { id: string }, index: number) => {
    if (authContext.getUserData !== false) {
      const data = onToggleBookMark(
        item.id,
        index,
        postData,
        authContext.getUserData.uid
      );
      setData(data);
      const filterData: any = data.filter((filterItem: any) => {
        AppConsolelog("--itemId--", item.id);
        return filterItem.id === item.id;
      });
      AppConsolelog("--filterData--", filterData);
      dispatch(
        updateBookMarkPosts({
          payload: filterData,
          isConcat: true,
        })
      );
      return;
    } else {
      emitter.emit("alert", "cate_alert");
    }
  };

  // props.webviewRef.current = webViewRef.current;

  const onWebViewMessage = (event: WebViewMessageEvent) => {
    setWebviewHeight(Number(event.nativeEvent.data));
    // console.log(event.nativeEvent.data, "--event.native--", myItem);
    // console.log("webviewHeight:", event.nativeEvent.data);
  };

  if (myItem) {
    return (
      <View style={{ width: fw }}>
        <StatusBar
          translucent={false}
          backgroundColor={Colors[theme].background}
          barStyle={theme === "dark" ? "light-content" : "dark-content"}
        />
        {sliderModal ? (
          <SingleImageModal
            closeHandler={sliderHandler}
            imageUrl={myItem?.images}
          />
        ) : null}
        {/* <ScrollView
          style={{ width: fw }}
          onScroll={props.onScroll}
          removeClippedSubviews={true}
          overScrollMode="never"
        > */}
        {/* {myItem?.images && myItem.images?.length ? (
            <Pressable
              onPress={sliderHandler}
              style={{ height: 250, width: "100%" }}
            >
              <Image
                source={{
                  uri: myItem.images[0].url,
                }}
                // resizeMode="stretch"
                style={{
                  flex: 1,
                  borderRadius: 1,
                  minWidth: fw,
                  // height: 84,
                  resizeMode: "contain",
                }}
              />
            </Pressable>
          ) : null} */}
        <View style={styles.singleBox}>
          <View>
            {/* {myItem?.images &&
              myItem.images?.length &&
              myItem.images[0]?.title ? (
                <View style={styles.paddingHorizontal}>
                  <Text style={styles.sourceTextStyle}>
                    {myItem.images[0]?.title}
                  </Text>
                </View>
              ) : null}
              <View style={{ paddingHorizontal: 22 }}>
                <HeadingText
                  style={[
                    styles.headingTitle,
                    {
                      fontSize: storeSlice.configTextSize.heading.size,
                      lineHeight: storeSlice.configTextSize.heading.lineheight,
                      // width: fw,
                    },
                  ]}
                >
                  {myItem?.title}
                </HeadingText>
              </View> */}
            {/* <View style={{ paddingHorizontal: 22, marginBottom: 15 }}>
                <View className="flex-row items-center">
                  <TouchableNativeFeedback
                    onPress={
                      !audioLoading.endLoad && audioState.soundObj === null
                        ? onPlay
                        : () => {}
                    }
                  >
                    {audioLoading.initialLoad ? (
                      <ActivityIndicator
                        size={"small"}
                        color={Colors[theme].headingtext}
                        style={[styles.newsIcon]}
                      />
                    ) : (
                      <Image
                        source={require("../../../assets/images/news_listen_icon.png")}
                        style={styles.newsIcon}
                      />
                    )}
                  </TouchableNativeFeedback>
                  <TouchableNativeFeedback
                    onPress={
                      !audioLoading.endLoad && audioState.soundObj === null
                        ? onPlay
                        : () => {}
                    }
                  >
                    <Text
                      style={[
                        styles.audioText,
                        { color: Colors[theme].headingtext },
                      ]}
                    >
                      {myItem?.audio ? `${myItem.audio} audio` : ""}
                    </Text>
                  </TouchableNativeFeedback>
                  <FontAwesome
                    name="circle"
                    size={4}
                    style={styles.circleIcon}
                  />
                  <TouchableNativeFeedback>
                    <Text
                      style={[
                        styles.timeText,
                        { color: Colors[theme].headingtext },
                      ]}
                      className="px-1 self-center"
                    >
                      {myItem?.audio ? `${myItem.audio} read` : ""}
                    </Text>
                  </TouchableNativeFeedback>
                </View>
              </View> */}
            {/* <Text style={styles.authorText}>
                {myItem.author ? "By " : ""}
                <Text
                  style={[
                    styles.authorText,
                    { color: Colors[theme].headingtext },
                  ]}
                >
                  {myItem.author ? `${myItem.author} - ` : ""}
                  <>
                    {myItem.pubDate && (
                      <Text
                        style={[
                          styles.authorText,
                          { color: Colors[theme].headingtext },
                        ]}
                      >
                        {myItem.pubDate}
                      </Text>
                    )}
                  </>
                </Text>
              </Text> */}
            <View
              style={{
                width: fw,
                height: fh,
                paddingHorizontal: 22,
                overflow: "hidden",
              }}
              pointerEvents="box-none"
            >
              <WebView
                ref={webViewRef}
                originWhitelist={["*"]}
                source={{
                  html: `
                  <!DOCTYPE html>
                      <html>
                      <head>
                      <meta charset="utf-8">
                      <meta name="viewport" content="width=device-width, initial-scale=1 maximum-scale=1, user-scalable=no">
                      <style>
                      *{margin:0; padding:0; box-sizing:border-box;}
                        img{width:${width}px;}
                        h2{
                          font-size: ${storeSlice.configTextSize.h2.size}px;
                          line-height: ${
                            storeSlice.configTextSize.h2.lineheight
                          }px;
                          font-family: "Poppins-SemiBold";
                          color: ${Colors[theme].headingtext};
                          margin: 0;
                          margin-bottom: 22px;
                         }
                         h3{
                          font-size:${storeSlice.configTextSize.h3.size}px;
                          line-height: ${
                            storeSlice.configTextSize.h3.lineheight
                          }px;
                          font-family: "Poppins-SemiBold";
                          color: ${Colors[theme].headingtext};
                          margin: 0;
                          margin-bottom: 22px;
                          }
                        h4{
                        font-size: ${storeSlice.configTextSize.h4.size}px;
                        line-height: ${
                          storeSlice.configTextSize.h4.lineheight
                        }px;
                        font-family: "Poppins-SemiBold";
                        color: ${Colors[theme].headingtext};
                        margin: 0;
                        margin-bottom: 22px;
                        }
                        h5{
                        font-size: ${storeSlice.configTextSize.text.size}px;
                        line-height: ${
                          storeSlice.configTextSize.text.lineheight
                        }px;
                        font-family: "Poppins-SemiBold";
                        color: ${Colors[theme].headingtext};
                        margin: 0;
                        margin-bottom: 22px;
                        }
                        p{
                        font-size: ${storeSlice.configTextSize.text.size}px;
                        line-height: ${
                          storeSlice.configTextSize.text.lineheight
                        }px;
                        font-weight: "400";
                        font-family: "Poppins-Regular";
                        color: ${Colors[theme].headingtext};
                        margin: 0;
                        margin-bottom: 22px;
                        }
                        a{
                        font-size: ${storeSlice.configTextSize.text.size}px;
                        line-height: ${
                          storeSlice.configTextSize.text.lineheight
                        }px;
                        font-weight: "400";
                        font-family: "Poppins-Medium";
                        color: "#0db04b";
                        }
                        figure{
                          margin: 0;
                          margin-bottom: 30px;
                          display:flex;
                          flex: 1;
                          height: 100%;
                          justify-content: center;
                          align-items: center;
                          }
                        iframe{
                          margin-bottom: -5px;
                          margin-top: 2px;
                          width: sw - 30px;
                          }
                        ul{
                          list-style:disc;
                          margin:0;
                          margin-bottom:18px;
                          }
                        ol{
                          margin:0;
                          margin-bottom:18px;
                          }
                        li{
                          font-size: ${storeSlice.configTextSize.text.size}px;
                          line-height: ${
                            storeSlice.configTextSize.text.lineheight
                          }px;
                          font-weight: "400";
                          font-family: "Poppins-Regular";
                          color: ${Colors[theme].headingtext};
                          margin: 0;
                          margin-bottom: 5px;
                          }
                        table{
                          borderWidth: 0.5px;
                          borderColor: ${Colors[theme].shadowColor};
                          margin: 0;
                          marginTop: 7px;
                          marginBottom: 28px;
                          }
                        th{
                          borderWidth: 0.5px;
                          borderColor: ${Colors[theme].shadowColor};
                          text-align: left;
                          padding: 8px;
                          vertical-align:center;
                          }
                        td{
                          borderWidth: 0.5px;
                          borderColor: ${Colors[theme].shadowColor};
                          text-align: left;
                          padding: 8px;
                          vertical-align:center;
                          }
                      </style>
                      </head>
                      <body style="width:100%; max-width:${
                        fw - 44
                      }px; margin:0;  box-sizing:border-box;">
                        ${myItem.description}
                      </body>
                  </html>`,
                }}
                style={{
                  flex: 1,
                  opacity: 0.99,
                  // overflow: "hidden",
                  marginBottom: 100,
                  marginTop: 30,
                }}
                // androidHardwareAccelerationDisabled={false}
                androidLayerType={
                  Platform.OS === "android" && Platform.Version <= 22
                    ? "hardware"
                    : "none"
                }
                renderToHardwareTextureAndroid={true}
                // automaticallyAdjustContentInsets={true}
                javaScriptEnabled={true}
                // onMessage={onWebViewMessage}
                injectedJavaScript={`
                    const meta = document.createElement('meta');
                    meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
                    meta.setAttribute('name', 'viewport');
                    document.getElementsByTagName('head')[0].appendChild(meta);
                    document.documentElement.style.overflowX = 'hidden';
                    document.body.style.userSelect = 'none';
                    var scrollEventHandler = function()
                    {
                      window.scroll(0, window.pageYOffset)
                    }
              `}
                injectedJavaScriptBeforeContentLoaded={runBeforeFirst}
                // scalesPageToFit
                // pagingEnabled
                scrollEnabled
                showsHorizontalScrollIndicator
                decelerationRate="normal"
                // nestedScrollEnabled
                contentMode="mobile"
                // allowsBackForwardNavigationGestures
                // showsHorizontalScrollIndicator={true}
              />
            </View>
            {/* <View style={[styles.liveMintStrip]}>
                <View
                  className="flex-row items-center justify-between"
                  style={[
                    styles.liveMintInner,
                    {
                      backgroundColor: theme === "dark" ? "#2a2a2a" : "#f1f1f1",
                    },
                  ]}
                >
                  <Text
                    className="flex-row items-center"
                    style={styles.sourcedVia}
                  >
                    Sourced via :{" "}
                  </Text>
                  <View
                    className="flex-row flex-1"
                    style={{ backgroundColor: "transparent" }}
                  >
                    <Image
                      source={{ uri: myItem.logo }}
                      style={styles.livemintlogo}
                    />
                  </View>
                </View>
              </View>
              {postData && postData.length ? (
                <>
                  <View
                    className="flex-row justify-center items-center"
                    style={[
                      styles.madeforyouBox,
                      { shadowColor: theme === "dark" ? "#fff" : "#000" },
                    ]}
                  >
                    <HeadingText style={styles.madeforyouText}>
                      More for you
                    </HeadingText>
                  </View>
                  <View>
                    <FlatList
                      data={postData}
                      renderItem={({ item, index }: any) => {
                        return (
                          <PostsCard
                            item={item}
                            postdata={postData}
                            myindex={index}
                            tcolor={null}
                            postDataRef={postDataRef}
                            moreforyou={true}
                            showTags={true}
                            onToggleBookmark={() =>
                              onToggleBookmark(item, index)
                            }
                          />
                        );
                      }}
                      keyExtractor={(item, key) => key.toString()}
                    />
                  </View>
                </>
              ) : null} */}
          </View>
        </View>
        {/* </ScrollView> */}
        <View className="flex-row w-100 justify-center"></View>
      </View>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <Text className="font-bold">Error loading article</Text>
        <TouchableNativeFeedback onPress={() => navigation.navigate("Root")}>
          <Text className="pt-10">Go back to Home</Text>
        </TouchableNativeFeedback>
      </SafeAreaView>
    );
  }
};
export default memo(PostDetailScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headingTitle: {
    fontSize: 24,
    lineHeight: 27,
    letterSpacing: -0.61,
    fontFamily: "Gabriela-Semibold",
    //paddingHorizontal: 22,
    marginBottom: 7,
    marginTop: 8,
  },
  singleBox: {
    position: "relative",
    paddingTop: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: -25,
    //backgroundColor:'red'
  },
  paddingHorizontal: {
    paddingHorizontal: 22,
  },
  sourceTextStyle: {
    fontSize: 10,
    lineHeight: 16,
    //paddingHorizontal: 22,
    fontFamily: "Poppins-Italic",
    marginBottom: 6,
  },
  imgSrcText: {
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 0,
    color: "#808080",
    //marginBottom:18,
    //fontStyle: 'italic',
    fontFamily: "Poppins-Italic",
    paddingHorizontal: 22,
    marginTop: -2,
  },
  audioText: {
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: 0,
    // color: "#333333",
  },
  timeText: {
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: 0,
    // color: "#333333",
  },
  authorText: {
    fontSize: 12,
    lineHeight: 15,
    letterSpacing: 0,
    // color: "#333333",
    paddingHorizontal: 22,
    marginBottom: 16,
  },
  liveMintStrip: {
    // backgroundColor: "#f1f1f1",
    marginTop: 3,
    marginBottom: 33,
  },
  liveMintInner: {
    // backgroundColor: "#f1f1f1",
    paddingHorizontal: 22,
    paddingVertical: 25,
  },
  sourcedVia: {
    fontSize: 14,
    lineHeight: 26,
    letterSpacing: 0,
    // color: "#666666",
    marginLeft: 4,
    marginTop: 2,
  },
  madeforyouBox: {
    borderTopColor: "#0db04b",
    borderTopWidth: 3,
    // backgroundColor: "#fff",
    marginBottom: 10,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 5,
  },
  madeforyouText: {
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: 0,
    // color: "#333333",
    fontFamily: "Poppins-SemiBold",
    paddingTop: 23,
    paddingBottom: 23,
  },
  circleIcon: {
    marginRight: 10,
    paddingTop: 0,
    marginLeft: 14,
    color: "#A7A7A7",
    display: "flex",
    alignSelf: "center",
  },
  newsIcon: {
    width: 30,
    height: 30,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  livemintlogo: {
    width: 150,
    height: 35,
    marginLeft: "auto",
    marginRight: "auto",
    left: -2,
    resizeMode: "contain",
  },
});

/**
 * onPress(id) of Card in Flatlist -> navigate("ArticleScreen",{
 * id})
 *
 * ArticleScreen=({
 * route})=>{
 * const id = route.id
 * const data = getData(id)
 * idState = id
 * useEffect(()=>{
 * const r= BackHandler.addEventListener('hardwareBackPress', function () {

 * navigate("HomeScreen")}
}  
return r.removerListener()
},[])
 *  return <PanGestureHandler
 *  onPanLeft={({x,y})=>{
 * if(scrolledEnoughLeft){
 *  navigate("ArticleScreen",getPreviousId(id))} or setIdState(getPreviousId(id))
 * }}else if(scrolledEnoughRight){
 *  navigate("ArticleScreen",getNextId(id))} or ...
 * }
 * ><WebView
 *  data
 * />
 * </PanGestureHandler>
 * }
 */

//https://docs.swmansion.com/react-native-gesture-handler/docs/gesture-handlers/api/pan-gh/

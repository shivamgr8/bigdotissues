import React, { useEffect, useState, useContext } from "react";
import { HeadingText, View } from "../Themed";
import {
  StyleSheet,
  TouchableOpacity,
  Share,
  Dimensions,
  BackHandler,
  AppState,
  ActivityIndicator,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import ImageTabBarIcon from "../../components/ImageTabBarIcon";
import { Audio } from "expo-av";
import MediaPlayer from "./MediaPlayer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeAsyncData } from "../../hooks/asyncStorage";
import {
  onPlayAudio,
  onToggleBookMark,
  pauseAudio,
  resumeAudio,
} from "../../utils/utilityFunctions";
import { itemType } from "../../../types";
import emitter from "../../hooks/emitter";
import { AppConsolelog } from "../../utils/commonFunctions";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Shadow } from "react-native-shadow-2";
import Colors from "../../constants/Colors";
import usePrefetchTheme from "../../hooks/usePrefetchTheme";
import useColorScheme from "../../hooks/useColorScheme";
import { updateSourceSlices } from "../../services/redux/slices/sourcesSlices";
import { useDispatch, useSelector } from "react-redux";
import {
  api_GetSourcePreferences,
  api_getSources,
  api_SaveSourcePreferences,
  api_updateHistoryOnline,
  getPostAudio,
} from "../../services/network/apiServices";
import { onShareHandler } from "../../utils/utilityFunctions";
import {
  stopAudio,
  updateAudioSlice,
} from "../../services/redux/slices/AudioSlice";
import { updateBookMarkPosts } from "../../services/redux/slices/bookmarksPosts";
import { updateHistoryPosts } from "../../services/redux/slices/historyPosts";

let fw = Dimensions.get("screen").width;
let fh = Dimensions.get("screen").height;

export default function SingleFooter(props: {
  item: itemType;
  backHandler: any;
  singlefooterRef: any;
  scrollRef: any;
  stopAudioRef: any;
  postData: any;
  postDataRef: any;
  myIndex: any;
}) {
  const dispatch = useDispatch();
  const data = useSelector((state: any) => state.sourceSlice.data);
  const audioState = useSelector((state: any) => state.audioSlice.data);
  const selectedSourceData = useSelector(
    (state: any) => state.sourceSlice.selectedData
  );

  let theme = usePrefetchTheme();
  const colorScheme = useColorScheme();
  if (theme !== "dark" && theme !== "light") {
    theme = colorScheme;
  }

  const [isBookmark, setBookmark] = useState(false);
  const [isOptions, setOptions]: any = useState(false);
  const [fontSize, setFontSize]: any = useState(false);
  const [audioLoading, setAudioLoading] = useState({
    initialLoad: false,
    endLoad: false,
  });

  useEffect(() => {
    const handleChange = AppState.addEventListener("change", (changedState) => {
      if (changedState === "background") {
        onStop();
        console.log("-----background---");
      }
    });
    return () => {
      handleChange.remove();
    };
  }, []);

  const backAction = () => {
    handleBack();
    return true;
  };
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, []);

  const audio_url =
    "https://www.speakatoo.com/tts_file/user/WXiHIChjs6d85354282e08749a29661b05cd68c3eWTKmyfQdA.mp3";
  // "https://www.kozco.com/tech/LRMonoPhase4.mp3";

  useEffect(() => {
    setBookmark(props.item.is_bookmark === true ? true : false);
    storePosts(props.item.id, props.item);
    dispatch(
      updateHistoryPosts({
        payload: [props.item],
        isConcat: true,
      })
    );
    return () => {};
  }, [props.item.id]);

  //----------start: HistoryPosts-------------
  const storePosts = async (postId: any, item: any) => {};
  //----------end: HistoryPosts-------------

  //-----------------------start: audio------------------------

  const handleBack = () => {
    AppConsolelog("--backAction--");
    onStop();
    props.backHandler();
  };
  //-----------------------end: audio------------------------

  //-----------------------start: share------------------------
  const shareLink = async () => {
    setOptions(false);
    const items = {
      itemId: props.item?.id,
      itemTitle: props.item?.title.trim(),
      itemDescription: props.item?.description.slice(0, 10),
      itemImage: props.item?.images[0]?.url,
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
  //-----------------------end: share------------------------

  //-----------------------start: bookmark------------------------

  const onToggleBookmark = () => {};
  //-----------------------end: bookmark------------------------

  //-------------------start: show options-------------
  const onShowOptions = () => {
    fontSize || isOptions ? setOptions(false) : setOptions(true);
    onStop();
    setFontSize(false);
  };

  const onTextFalse = () => {
    setFontSize(false);
    setOptions(false);
  };

  const onCopyLink = async () => {
    setOptions(false);
    const items = {
      itemId: props.item?.id,
      itemTitle: props.item?.title.trim(),
      itemDescription: props.item?.description.slice(0, 10),
      itemImage: props.item?.images[0]?.url,
    };
    let shareUrl;
    try {
      shareUrl = await onShareHandler(items);
      console.log("---shareurl---", shareUrl);
    } catch (error) {
      console.log("--shareerror--", error);
    }
    try {
      if (shareUrl !== undefined) {
        copyToClipboard(shareUrl);
      }
    } catch (error) {
      emitter.emit("alert", "sharingErr");
    }
    emitter.emit("alert", "copy");
  };

  const copyToClipboard = async (text: string) => {
    try {
      await Clipboard.setStringAsync(text);
    } catch (error: any) {
      console.log("Clipboard error: " + error.message);
    }
  };
  //-------------------end: show options-------------

  const handleTextSize = () => {
    setFontSize(!fontSize);
    setOptions(false);
  };

  const handleSourceMute = async () => {};

  const onPlay = async () => {
    try {
      setAudioLoading({ initialLoad: true, endLoad: true });
      getPostAudio(props.item.id).then(async (res: any) => {
        if (res.status === "success") {
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

  const onPause = async () => {
    try {
      if (audioState.soundObj.isLoaded && audioState.soundObj.isPlaying) {
        const status = await pauseAudio(audioState.playbackObj);
        return dispatch(
          updateAudioSlice({
            playbackObj: audioState.playbackObj,
            soundObj: status,
          })
        );
      }
    } catch (error) {
      AppConsolelog("--error--", error);
    }
  };

  const onResume = async () => {
    try {
      if (audioState.soundObj.isLoaded && !audioState.soundObj.isPlaying) {
        const status = await resumeAudio(audioState.playbackObj);
        console.log("resumeAudio");
        return dispatch(
          updateAudioSlice({
            playbackObj: audioState.playbackObj,
            soundObj: status,
          })
        );
      }
    } catch (error) {
      AppConsolelog("--error--", error);
    }
  };

  const onStop = async () => {
    try {
      dispatch(stopAudio());
    } catch (error) {
      AppConsolelog("--error--", error);
    }
  };

  props.scrollRef.current = { onTextFalse: onTextFalse };
  props.singlefooterRef.current = { onPlay: onPlay };
  props.scrollRef.current = { onTextFalse: onTextFalse };
  props.stopAudioRef.current = {
    onStop: onStop,
    onTextFalse: onTextFalse,
  };

  return (
    <>
      <View
        style={styles.singleFooterParent}
        className="flex-row items-center justify-between flex-1"
      >
        <Shadow
          distance={8}
          startColor={theme === "dark" ? "#00000040" : "#00000040"}
          offset={[4, 4]}
        >
          <View
            className="flex flex-row items-center justify-between"
            style={styles.shadowInnerbox}
          >
            <View style={styles.singleFooterLeft} className="">
              <TouchableOpacity onPress={handleBack}>
                <ImageTabBarIcon
                  myasset_name="singleArrow"
                  focused={false}
                  style={styles.singleFooterRightIcons}
                />
              </TouchableOpacity>
            </View>

            <View
              style={styles.singleFooterRight}
              className="flex-row items-center justify-between"
            >
              <TouchableOpacity
                onPress={
                  !audioLoading.endLoad && audioState.soundObj === null
                    ? () => onPlay()
                    : () => {}
                }
                // onPress={() => onPlay()}
              >
                {audioLoading.initialLoad ? (
                  <ActivityIndicator
                    size={"small"}
                    color={Colors[theme].headingtext}
                  />
                ) : (
                  // <TouchableOpacity>
                  <ImageTabBarIcon
                    myasset_name="singleHeadphone"
                    focused={false}
                    style={styles.singleFooterRightIcons}
                  />
                  // </TouchableOpacity>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={onToggleBookmark}>
                <ImageTabBarIcon
                  myasset_name={
                    theme === "dark" ? "singleShortlistdark" : "singleShortlist"
                  }
                  focused={isBookmark}
                  style={[styles.singleFooterRightIcons, { marginLeft: 26 }]}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={shareLink}>
                <ImageTabBarIcon
                  myasset_name="singleForward"
                  focused={false}
                  style={[styles.singleFooterRightIcons, { marginLeft: 25 }]}
                />
              </TouchableOpacity>
              <TouchableWithoutFeedback onPress={onShowOptions}>
                <ImageTabBarIcon
                  myasset_name="singleDot"
                  focused={false}
                  style={[styles.singleFooterRightIcons, { marginLeft: 19 }]}
                />
              </TouchableWithoutFeedback>
            </View>
          </View>

          {audioState.soundObj !== null ? (
            <MediaPlayer
              title={props.item.title}
              pauseHandler={onPause}
              stopHandler={onStop}
              replayHandler={onResume}
            />
          ) : null}

          {fontSize ? (
            <View style={styles.fontSizeBoxParent}>
              <TouchableWithoutFeedback
                style={styles.tbodyClick}
                onPress={onShowOptions}
              >
                {/* <></> */}
              </TouchableWithoutFeedback>
              <View style={styles.fontSizeActionBox}>
                {/* <FontSizeComponent showPreview={false} /> */}
              </View>
            </View>
          ) : null}
        </Shadow>
      </View>

      {isOptions ? (
        <View style={styles.tripleDotModalWrap}>
          <View style={styles.tbody}>
            <TouchableWithoutFeedback
              style={styles.tbodyClick}
              onPress={onShowOptions}
            >
              <></>
            </TouchableWithoutFeedback>
          </View>
          <Shadow
            distance={8}
            startColor={theme === "dark" ? "#00000040" : "#00000040"}
            offset={[1, 4]}
          >
            <View
              style={[
                styles.tripleDotModal,
                {
                  paddingBottom: 5,
                  borderColor: Colors[theme].shadowColor,
                },
              ]}
            >
              <TouchableOpacity onPress={handleTextSize}>
                <View
                  className="flex-row items-center"
                  style={styles.tripleDotRow}
                >
                  <ImageTabBarIcon
                    myasset_name="textSize"
                    style={styles.tripleDotModalIcon}
                  />
                  <HeadingText style={styles.tripleDotText}>
                    Text Size
                  </HeadingText>
                </View>
              </TouchableOpacity>
              {(selectedSourceData && selectedSourceData.length >= 6) ||
              selectedSourceData === undefined ? (
                <TouchableOpacity onPress={handleSourceMute}>
                  <View
                    className="flex-row items-center"
                    style={styles.tripleDotRow}
                  >
                    <ImageTabBarIcon
                      myasset_name="muteIcon"
                      style={styles.tripleDotModalIcon}
                    />
                    <HeadingText style={styles.tripleDotText}>
                      Mute {props.item.source}
                    </HeadingText>
                  </View>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity onPress={onCopyLink}>
                <View
                  className="flex-row items-center"
                  style={styles.tripleDotRow}
                >
                  <ImageTabBarIcon
                    myasset_name="copyLink"
                    style={styles.tripleDotModalIcon}
                  />
                  <HeadingText style={styles.tripleDotText}>
                    Copy Link
                  </HeadingText>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={shareLink}>
                <View
                  className="flex-row items-center"
                  style={styles.tripleDotRow}
                >
                  <ImageTabBarIcon
                    myasset_name="singleForward"
                    // source={require("../../assets/images/img/share.png")}
                    style={styles.tripleDotModalIcon}
                  />
                  <HeadingText style={styles.tripleDotText}>Share</HeadingText>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={onToggleBookmark}>
                <View
                  className="flex-row items-center"
                  style={styles.tripleDotRow}
                >
                  <ImageTabBarIcon
                    myasset_name={
                      theme === "dark"
                        ? "singleShortlistdark"
                        : "singleShortlist"
                    }
                    focused={isBookmark}
                    style={styles.tripleDotModalIcon}
                  />
                  <HeadingText style={styles.tripleDotText}>
                    Bookmark
                  </HeadingText>
                </View>
              </TouchableOpacity>
            </View>
          </Shadow>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  singleFooterParent: {
    backgroundColor: "#fff",
    paddingHorizontal: 0,
    width: fw,
  },
  shadowInnerbox: {
    width: fw,
    paddingHorizontal: 22,
    paddingVertical: 18,
  },
  singleFooterLeft: {},
  singleFooterRight: {},
  singleFooterRightIcons: {
    width: 20,
    height: 20,
    resizeMode: "contain",
  },
  tbody: {
    flex: 1,
    backgroundColor: "rgb(255 255 255 / 0%);",
  },
  tbodyClick: {
    height: "100%",
  },
  tripleDotModalWrap: {
    position: "absolute",
    bottom: 56,
    zIndex: -1,
    height: fh,
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "rgba(52, 52, 52, 0)",
  },
  tripleDotModal: {
    // backgroundColor: "#fff",
    width: fw,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingVertical: 0,
    // borderWidth: 1,
    borderBottomWidth: 0,
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowColor: "#000000",
    elevation: 12,
  },
  tripleDotRow: {
    paddingHorizontal: 30,
    paddingVertical: 16,
    backgroundColor: "transparent",
  },
  tripleDotText: {
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0,
    // color: "#333333",
    fontFamily: "Poppins-Regular",
  },
  tripleDotModalIcon: {
    width: 20,
    height: 20,
    marginRight: 14,
    resizeMode: "contain",
  },
  fontSizeBoxParent: {
    position: "absolute",
    bottom: 56,
    left: 0,
    right: 0,
    width: fw,
    height: fh,
    backgroundColor: "rgba(52, 52, 52, 0)",
  },
  fontSizeActionBox: {
    paddingHorizontal: 0,
    // paddingVertical: 22,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: "#fff",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderColor: "#e5e5e5",
    borderBottomWidth: 0,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowColor: "#000000",
    elevation: -4,
  },
});

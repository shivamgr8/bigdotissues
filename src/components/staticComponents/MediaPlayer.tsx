import React, { useState, useEffect } from "react";
import { Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Text, View } from "../../components/Themed";
import ImageTabBarIcon from "../ImageTabBarIcon";
import usePrefetchTheme from "../../hooks/usePrefetchTheme";
import useColorScheme from "../../hooks/useColorScheme";
import { useDispatch, useSelector } from "react-redux";
import { updateAudioSlice } from "../../services/redux/slices/AudioSlice";
interface MediaProps {
  pauseHandler: any;
  stopHandler: any;
  replayHandler: any;
  title: string;
}

var screenWidth = Dimensions.get("window").width;
const screenWidths = Dimensions.get("screen").width;
export default function MediaPlayer(props: MediaProps) {
  const dispatch = useDispatch();
  const audioState = useSelector((state: any) => state.audioSlice.data);
  let theme = usePrefetchTheme();
  const colorScheme = useColorScheme();
  if (theme !== "dark" && theme !== "light") {
    theme = colorScheme;
  }

  const [sliderValue, setSliderValue] = useState({
    playbackPostion: null,
    playbackDuration: null,
  });

  useEffect(() => {
    if (audioState.playbackObj) {
      audioState.playbackObj.setOnPlaybackStatusUpdate(onPlayBackStatusUpdate);
    }
  }, []);

  const onPlayBackStatusUpdate = (playbackStatus: any) => {
    setSliderValue({
      playbackPostion: playbackStatus.positionMillis,
      playbackDuration: playbackStatus.durationMillis,
    });
    if (playbackStatus.didJustFinish) {
      setSliderValue({
        playbackPostion: null,
        playbackDuration: null,
      });
      return dispatch(
        updateAudioSlice({
          playbackObj: null,
          soundObj: null,
        })
      );
    }
  };

  return (
    <View
      style={[
        styles.floatingBox,
        {
          backgroundColor: theme === "dark" ? "#000" : "#fff",
          borderBottomColor: theme === "dark" ? "#666666" : "#999999",
        },
      ]}
    >
      <View
        style={[
          styles.mediaPlayerBox,
          { backgroundColor: theme === "dark" ? "#000" : "#ececec" },
        ]}
      >
        <View style={styles.mediaPlayerInner}>
          <View className="flex-row items-center" style={styles.playerTextBox}>
            <ImageTabBarIcon
              myasset_name="singleHeadphone"
              style={[
                styles.headphoneIcon,
                { backgroundColor: theme === "dark" ? "#000" : "#ececec" },
              ]}
            />
            <Text numberOfLines={1} style={styles.newsText}>
              {props.title}
            </Text>
          </View>

          <View style={styles.actionBtnGroup}>
            {audioState.soundObj && audioState.soundObj.isPlaying && (
              <TouchableOpacity onPress={() => props.pauseHandler()}>
                <View
                  className="flex-row items-center justify-center"
                  style={styles.playBtn}
                >
                  <Image
                    source={require("../../assets/images/img/pause.png")}
                    style={styles.pauseIcon}
                  />
                </View>
              </TouchableOpacity>
            )}
            {audioState.soundObj && !audioState.soundObj.isPlaying && (
              <TouchableOpacity onPress={() => props.replayHandler()}>
                <View
                  className="flex-row items-center justify-center"
                  style={styles.playBtn}
                >
                  <Image
                    source={require("../../assets/images/img/play_icon.png")}
                    style={styles.playIcon}
                  />
                </View>
              </TouchableOpacity>
            )}
            {/* {Platform.OS == "android" ? (
              <View style={{ width: 54 }}></View>
            ) : null} */}
            <View
              className="flex-row items-center justify-center"
              style={styles.closeBtn}
            >
              <TouchableOpacity
                onPress={async () => {
                  props.stopHandler();
                }}
              >
                <ImageTabBarIcon
                  myasset_name="close"
                  style={styles.closeIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.mediaProcessBar}>
          <View
            style={[
              styles.mediaProcessBarActive,
              {
                width:
                  sliderValue.playbackDuration && sliderValue.playbackPostion
                    ? (sliderValue.playbackPostion /
                        sliderValue.playbackDuration) *
                      screenWidths
                    : 0,
              },
            ]}
          ></View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingBox: {
    position: "absolute",
    bottom: 56,
    right: 0,
    left: 0,
    height: 75,
    //borderBottomWidth:.2
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 1.5,
  },
  mediaPlayerBox: {
    // backgroundColor: "#ececec",
    width: screenWidth,
    height: 54,
  },
  mediaPlayerInner: {
    backgroundColor: "transparent",
    margin: "auto",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  playerTextBox: {
    backgroundColor: "transparent",
  },
  newsText: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
    // color: "#4D4D4D",
    fontStyle: "italic",
    maxWidth: 175,
    paddingLeft: 15,
  },
  actionBtnGroup: {
    backgroundColor: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    flexDirection: "row",
    width: 120,
    // borderWidth: 1,
  },
  playBtn: {
    width: 54,
    height: 54,
    backgroundColor: "transparent",
  },
  closeBtn: {
    width: 54,
    height: 54,
    marginLeft: 10,
  },
  mediaProcessBar: {
    position: "relative",
    backgroundColor: "#bfbfbf",
    width: "100%",
    height: 4,
  },
  mediaProcessBarActive: {
    position: "relative",
    backgroundColor: "#0DB04B",
    height: 4,
  },
  headphoneIcon: {
    width: 34,
    height: 34,
    resizeMode: "contain",
  },
  pauseIcon: {
    width: 18,
    height: 18,
  },
  playIcon: {
    width: 18,
    height: 18,
  },
  closeIcon: {
    width: 18,
    height: 18,
  },
});

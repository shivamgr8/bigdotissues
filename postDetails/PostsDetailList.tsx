import React, { useRef } from "react";
import { useContext, useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import { View, Text } from "../../../components/Themed";
import { useNavigation } from "@react-navigation/native";
import BreakingNewsStrip from "../../../components/staticComponents/BreakingNewsStrip";
import PostDetailScreen from "./PostDetailScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import SingleFooter from "../../../components/staticComponents/SingleFooter";
import ScreenLoader from "../../../components/staticComponents/ScreenLoader";
import { AuthContext } from "../../../hooks/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppConsolelog } from "../../../utils/commonFunctions";
import {
  findInObject,
  saveOnlineRecentCategories,
  saveRecentCategories,
} from "../../../utils/utilityFunctions";
import { apiSaveRecentCategories } from "../../../services/network/apiServices";
import { useDispatch, useSelector } from "react-redux";
import { updateRecentCategory } from "../../../services/redux/slices/recentCategorySlice";
import { stopAudio } from "../../../services/redux/slices/AudioSlice";
import { PanGestureHandler, Swipeable } from "react-native-gesture-handler";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const PostsDetailList = (props: any) => {
  console.log("PostsDetailList>> Cate ID:" + props.route.params);
  const authContext = useContext(AuthContext);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const onlineRecentCategorydata = useSelector(
    (state: any) => state.recentCategorySlice.recentCategoryData
  );
  const MyFacebookLoader = () => <ScreenLoader />;

  const [sw, setScreenWidth] = useState(Dimensions.get("screen").width);
  const [postData, setData] = useState<any>(props.route.params.postdata);
  const [myItem, setMyItem] = useState<any>();
  const [index, setIndex] = useState(0);
  const [isWebViewTouchable, setWebViewTouchable] = useState(true);

  const singleFooterRef = useRef<any>(null);
  const scrollRef = useRef<any>(null);
  const itemRef = useRef<any>(null);

  const flatListRef: any = useRef(FlatList);
  const indexRef = useRef(index);
  const stopAudioRef = useRef<any>(null);
  indexRef.current = index;
  const onScroll = useCallback(
    (event: {
      nativeEvent: {
        layoutMeasurement: { width: any };
        contentOffset: { x: number };
      };
    }) => {
      const slideSize = event.nativeEvent.layoutMeasurement.width;
      const index = event.nativeEvent.contentOffset.x / slideSize;
      const roundIndex = Math.round(index);
      const distance = Math.abs(roundIndex - index);
      const isNoMansLand = 0.4 < distance;
      if (roundIndex !== indexRef.current && !isNoMansLand) {
        setIndex(roundIndex);
      }
      if (roundIndex !== indexRef.current) {
        if (stopAudioRef.current) {
          stopAudioRef.current.onStop(true);
          stopAudioRef.current.onTextFalse();
        }
        setIndex(roundIndex);
      }
    },
    []
  );
  const flatListOptimizationProps = {
    initialNumToRender: 0,
    maxToRenderPerBatch: 1,
    removeClippedSubviews: true,
    scrollEventThrottle: 16,
    windowSize: 2,
    keyExtractor: useCallback((s: { id: any }) => String(s.id), []),
    getItemLayout: useCallback(
      (_: any, index: number) => ({
        index,
        length: windowWidth,
        offset: index * windowWidth,
      }),
      []
    ),
  };

  const handleBack = () => {
    dispatch(stopAudio());
    navigation.goBack();
    return true;
  };

  const renderItem = useCallback(({ item, index }: any) => {
    return (
      <PostDetailScreen
        key={index}
        item={item}
        index={postData[indexRef.current].id}
        onScroll={() => {
          if (stopAudioRef.current) {
            stopAudioRef.current.onTextFalse();
          }
        }}
        onPlay={() => {
          if (singleFooterRef.current) {
            singleFooterRef.current.onPlay();
          }
        }}
      />
    );
  }, []);
  const translateX = new Animated.Value(0);
  const translateY = new Animated.Value(0);

  const gestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    { useNativeDriver: true }
  );

  if (postData && postData.length) {
    return (
      <View style={{ flex: 1, zIndex: 99, borderWidth: 1 }}>
        <FlatList
          ref={flatListRef}
          data={postData}
          style={{ flex: 1, overflow: "hidden" }}
          renderItem={renderItem}
          pagingEnabled
          horizontal
          overScrollMode="always"
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onScroll={onScroll}
          initialScrollIndex={props.route.params.index}
          {...flatListOptimizationProps}
        />
        <View className="flex-row w-100 justify-center">
          <SingleFooter
            backHandler={handleBack}
            singlefooterRef={singleFooterRef}
            postData={postData}
            postDataRef={props.route.params.postDataRef}
            myIndex={indexRef.current}
            item={postData[indexRef.current]}
            scrollRef={scrollRef}
            stopAudioRef={stopAudioRef}
          />
        </View>
      </View>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ width: "100%", height: "100%" }}>
          <MyFacebookLoader />
        </View>
      </SafeAreaView>
    );
  }
};

export default PostsDetailList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gridBox: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#e2e2e2",
    paddingTop: 13,
    paddingBottom: 12,
    paddingHorizontal: 22,
  },
  fimage: {
    flex: 4,
    borderRadius: 10,
    minWidth: 80,
    height: 90,
  },
  title: {
    flex: 10,
    fontSize: 24,
    lineHeight: 27,
    letterSpacing: -0.5,
    marginTop: -4,
  },
  separator: {
    marginVertical: 0,
    height: 1,
    backgroundColor: "#cccccc",
    opacity: 0.5,
    width: "100%",
  },
  contentLR: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 0,
  },
  flex_h: {
    flexDirection: "row",
  },
  vcenter: {
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});

import React, { useContext, useEffect, useState, useCallback } from "react";
import { Dimensions, ActivityIndicator, RefreshControl } from "react-native";
import { View } from "../../../components/Themed";
import { useFocusEffect, useScrollToTop } from "@react-navigation/native";
import PostsCard from "../../../components/PostsCard";
import { FlashList } from "@shopify/flash-list";
import { api_getCategoryPosts } from "../../../services/network/apiServices";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { itemType } from "../../../../types";
import BreakingNewsStrip from "../../../components/staticComponents/BreakingNewsStrip";
import ScreenLoader from "../../../components/staticComponents/ScreenLoader";
import emitter from "../../../hooks/emitter";
import Colors from "../../../constants/Colors";
import { AuthContext } from "../../../hooks/AuthContext";
import useInternet from "../../../hooks/useInternet";
import { AppConsolelog } from "../../../utils/commonFunctions";
import { PostListProps } from "./types";
import { onToggleBookMark } from "../../../utils/utilityFunctions";
import { updateBookMarkPosts } from "../../../services/redux/slices/bookmarksPosts";
import { useDispatch } from "react-redux";

const PostsList = (props: PostListProps) => {
  const authContext = useContext(AuthContext);
  const MyFacebookLoader = () => <ScreenLoader />;
  const listRef = React.useRef<any>(null);
  const dispatch = useDispatch();
  let postDataRef = React.useRef<any>(null);
  let internet = useInternet();

  const [sw, setScreenWidth] = useState(Dimensions.get("screen").width);
  const [currentPage, setPage] = useState(1);
  const [isLoading, setLoading] = useState(true);
  const [postData, setData] = useState<any>([]);
  const [endReached, setEndReached] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const controller = new AbortController();
      const signal = controller.signal;
      if (postDataRef && postDataRef.current) {
        setData(postDataRef.current.postData);
        console.log("--postDataRef---", postData.length);
      }
      emitter.addListener("editBookmark", () => {
        setData([]);
        getPosts(signal);
      });

      return;
    }, [postDataRef.current])
  );

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  useEffect(() => {
    const onChange = (result: any) => {
      AppConsolelog("---result--", result);
      setScreenWidth(Dimensions.get("screen").width);
    };
    Dimensions.addEventListener("change", onChange);
    getCachePosts();
  }, [sw, authContext.getUserData]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (currentPage !== 1 && postData.length) {
      if (internet === true) {
        getPosts(signal);
      }
    }
    return () => {
      controller.abort;
    };
  }, [currentPage]);

  useScrollToTop(listRef);

  const getCachePosts = async () => {
    setData([]);
    try {
      const value: any = await AsyncStorage.getItem("bigdot_category_posts");
      if (value !== null && value != undefined) {
        const json = JSON.parse(JSON.parse(value));
        setData(json.data["cat_" + props.cate_id]);
      } else {
        const controller = new AbortController();
        const signal = controller.signal;
        getPosts(signal);
      }
    } catch (e) {
      AppConsolelog("--cachePostError--", e);
    }
  };

  const getPosts = async (tSignal: AbortSignal, page?: number) => {
    try {
      api_getCategoryPosts(props.cate_id, page || currentPage, tSignal).then(
        (json) => {
          if (json.data["cat_" + props.cate_id]?.length) {
            if (page === 1) {
              setLoading(false);
              setRefreshing(false);
              return setData(json.data["cat_" + props.cate_id]);
            }
            setData(postData.concat(json.data["cat_" + props.cate_id]));
            setLoading(false);
            setRefreshing(false);
            console.info("fetch page " + currentPage + " data received");
          } else {
            setEndReached(true);
          }
        }
      );
    } catch (error) {
      AppConsolelog("--apiPostError--", error);
    }
  };

  const handleLoadMore = () => {
    if (!endReached && !refreshing && !isLoading) setPage(currentPage + 1);
  };

  const handlePullRefresh = () => {
    console.info("handlePullRefresh called");
    if (!refreshing) {
      setPage(1);
      setRefreshing(true);
      setEndReached(false);
      setData([]);
      const controller = new AbortController();
      const signal = controller.signal;
      return getPosts(signal, 1);
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
      dispatch(updateBookMarkPosts({ payload: filterData, isConcat: true }));
      return;
    } else {
      emitter.emit("alert", "cate_alert");
    }
  };

  const RenderItem = ({ item, index }: any) => {
    return (
      <PostsCard
        key={index}
        item={item}
        myindex={index}
        postdata={postData}
        tcolor={null}
        postDataRef={postDataRef}
        moreforyou={false}
        showTags={true}
        onToggleBookmark={() => onToggleBookmark(item, index)}
      />
    );
  };

  const FooterComponent = ({ item }: any) => {
    if (!endReached && !refreshing) {
      return (
        <View style={{ padding: 10 }}>
          <ActivityIndicator color="#0daf4b" size={20} />
        </View>
      );
    } else {
      return (
        <View style={{ padding: 0, paddingBottom: 0 }}>
          {/* <Image source={require('../assets/images/finish.gif')} style={{width:"100%",height:280}} /> */}
        </View>
      );
    }
  };

  if (!isLoading) {
    return (
      <View style={{ flex: 1, width: "100%" }}>
        <BreakingNewsStrip />
        <FlashList
          data={postData}
          ref={listRef}
          renderItem={RenderItem}
          keyExtractor={(item: itemType, index) => index.toString()}
          extraData={postData}
          estimatedItemSize={300}
          ListFooterComponent={<FooterComponent />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              tintColor={Colors.light.tabIconDefault}
              colors={[Colors.light.tabIconDefault]}
              style={{ backgroundColor: "transparent" }}
              onRefresh={internet ? handlePullRefresh : () => {}}
              refreshing={refreshing}
            />
          }
        />
      </View>
    );
  } else {
    return (
      <View style={{ width: "100%" }}>
        <MyFacebookLoader />
      </View>
    );
  }
};

export default PostsList;

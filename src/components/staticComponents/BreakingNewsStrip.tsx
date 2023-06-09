import React, { useEffect, useState, useCallback } from "react";
import { async } from "@firebase/util";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StyleSheet, TouchableOpacity, Image } from "react-native";
import { storeAsyncData } from "../../hooks/asyncStorage";
import { api_breaking_news } from "../../services/network/apiServices";
import { Text, View } from "../Themed";
import { useFocusEffect } from "@react-navigation/native";

export default function BreakingNewsStrip() {
  const [toggle, setToggle] = useState(false);
  const [data, setData] = useState<any>("");

  // useFocusEffect(
  //   useCallback(() => {
  //     getBreakingNews();
  //   }, [])
  // );

  useEffect(() => {
    getBreakingNews();
  }, []);

  // const getBreakingNews = () => {
  //   try {
  //     api_breaking_news().then(async (response) => {
  //       if (response && response.Items.length !== 0) {
  //         const id = response.Items.id;
  //         const res = await AsyncStorage.getItem("bigdot_breaking_news");
  //         if (res === id.toString()) {
  //           console.log("---res---id----", res, id);
  //         }
  //       }
  //       // console.log("---breakingNews----", response.Items.id);
  //     });
  //   } catch (error) {
  //     console.log("--error---", error);
  //   }
  // };

  const getBreakingNews = async () => {
    try {
      const newsRes = await api_breaking_news();
      const res = await AsyncStorage.getItem("bigdot_breaking_news");
      if (newsRes.Items.length !== 0) {
        if (newsRes.Items.id === res) {
          // console.log("--Shivam--", res);
          setToggle(false);
          return;
        } else {
          storeAsyncData(+newsRes.Items.id, "breaking_news");
          setData(newsRes);
          setToggle(true);
          // console.log("--Shim--", newsRes.Items.id);
          return;
        }
      } else {
        setToggle(false);
      }
      // storeAsyncData(7, "breaking_news");
    } catch (error) {
      console.log("--getBreakingNewsError---", error);
    }
  };

  const toggleHandler = () => {
    setToggle(false);
  };

  // console.log("----datad----", toggle);
  // return <></>

  return (
    <>
      {toggle === true ? (
        <View
          className="flex-row items-center justify-between"
          style={styles.stripParent}
        >
          <Text style={styles.stripTitle}>
            <Text style={styles.tagBold}>BREAKING: </Text>
            {data.Items.title}
          </Text>
          <TouchableOpacity onPress={toggleHandler}>
            <Image
              source={require("../../assets/images/img/breaking_close.png")}
              style={styles.closeAction}
            />
          </TouchableOpacity>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  stripParent: {
    backgroundColor: "#b62619",
    width: "100%",
    paddingHorizontal: 22,
    paddingVertical: 10,
  },
  stripTitle: {
    fontSize: 11.98,
    lineHeight: 15,
    fontFamily: "Poppins-Regular",
    color: "#fff",
    letterSpacing: 0,
    flex: 2,
  },
  tagBold: {
    fontSize: 14,
    lineHeight: 15,
    color: "#fff",
    letterSpacing: 0,
    fontFamily: "Poppins-SemiBold",
  },
  closeAction: {
    width: 15,
    height: 15,
    marginLeft: 22,
  },
});

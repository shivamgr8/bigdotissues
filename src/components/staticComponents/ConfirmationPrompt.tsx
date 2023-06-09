import React, { useState } from "react";
import { Text, View, HeadingText } from "../../components/Themed";
import { StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { api_getCategories } from "../../services/network/apiServices";
import { storeAsyncData } from "../../hooks/asyncStorage";

export default function ConfirmationPrompt({ getCategories }: any) {
  const [cancel, setCancel] = useState(true);

  const cancelHandler = () => {
    setCancel(!cancel);
  };

  const onHandleReset = async () => {
    const respone = await api_getCategories();
    if (respone && respone.Items) {
      storeAsyncData(JSON.stringify(respone.Items), "categories");
      getCategories();
      setCancel(false);
    }
  };

  return (
    <>
      {cancel ? (
        <View style={styles.promptOverlay}>
          <View style={styles.promptBox}>
            <Text style={styles.promptText}>
              Are you sure you want to reset the category order?
            </Text>
            <View style={styles.promptActionBox}>
              <TouchableOpacity
                style={[
                  styles.promptActionParent,
                  { borderRightWidth: 0.2, borderRightColor: "#d9d9d9" },
                ]}
                onPress={cancelHandler}
              >
                <Text style={styles.promptActionText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.promptActionParent}
                onPress={onHandleReset}
              >
                <Text style={styles.promptActionText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  promptOverlay: {
    backgroundColor: "#00000050",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 9,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  promptBox: {
    maxWidth: 350,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  promptText: {
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0,
    fontFamily: "Poppins-Medium",
    color: "#333333",
    textAlign: "center",
    paddingVertical: 30,
    paddingHorizontal: 55,
  },
  promptActionParent: {
    width: "50%",
  },
  promptActionBox: {
    borderTopColor: "#d9d9d9",
    borderTopWidth: 0.2,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 5,
  },
  promptActionText: {
    fontSize: 14,
    lineHeight: 17,
    letterSpacing: 0,
    fontFamily: "Poppins-Medium",
    color: "#0db04b",
    paddingVertical: 17,
    paddingHorizontal: 15,
    textAlign: "center",
  },
});

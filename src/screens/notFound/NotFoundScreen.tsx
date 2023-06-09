import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { Text, View } from "../../components/Themed";
import { RootStackScreenProps } from "../../../types";

//export default function NotFoundScreen({ navigation }: RootStackScreenProps<'NotFound'>) {
export default function NotFoundScreen({ navigation }: any) {
  useEffect(() => {
    const routeIndex = navigation.getState().index;
    const route_name = navigation.getState().routeNames[routeIndex];
    const route_params = navigation.getState().routes[routeIndex].params;
    console.log("Not Found Params: " + route_params);
    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This screen doesn't exist.</Text>
      <TouchableOpacity
        onPress={() => navigation.replace("Root")}
        style={styles.link}
      >
        <Text style={styles.linkText}>Go to home screen!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});

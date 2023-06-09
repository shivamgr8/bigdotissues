import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useState, useEffect, useRef, useMemo } from "react";
import { Platform, Alert, Linking, AppState } from "react-native";
import * as Application from "expo-application";
import { axiosInstance } from "../services/network/configureAxios";
import { AppConsolelog } from "../utils/commonFunctions";
import * as IntentLauncher from "expo-intent-launcher";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function notificationsService() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<any>(false);
  const [uuid, setUUID] = useState<string | null>("");
  const [appState, setAppState] = useState(false);
  const notificationListener: any = useRef();
  const responseListener: any = useRef();

  useEffect(() => {
    const handleState = AppState.addEventListener("change", (changedState) => {
      if (changedState === "active") {
        AppConsolelog("--changedState--", changedState);
        setAppState(true);
      }
    });
    return () => {
      handleState.remove();
    };
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);

      let data = {
        devicetoken: token,
        platform: Platform.OS,
        platformversion: Platform.Version,
        device: Device.brand,
        appversion: Application.nativeBuildVersion,
      };
      //post_data('https://bigdot.news/api/bookmark/save',data);
      //console.info('Token: ' + token)
    });

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [appState]);

  useEffect(() => {
    if (Platform.OS == "android") setUUID(Application.androidId);
    if (Platform.OS == "ios") {
      try {
        Application.getIosIdForVendorAsync().then((res) => {
          setUUID(res);
        });
      } catch (e) {}
    }

    return () => {};
  }, []);

  if (expoPushToken != "" && uuid != null && uuid != "") {
    return {
      token: expoPushToken,
      uuid: uuid,
    };
  } else {
    return {};
  }
  //   return ({
  //     token:expoPushToken
  //   })

  // <View style={styles.container}>
  //   <Text>1 Your expo push token: {expoPushToken}</Text>
  //   <Text>2 Bigdot - app!2</Text>
  //   <Text>3 Title: {notification && JSON.stringify(notification)} </Text>
  //   <Text>4 Title: {notification && notification.request.content.title} </Text>
  //   <Text>5 Body: {notification && notification.request.content.body}</Text>
  //   <Text>6 Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
  //   <Text>7 Platform OS: {Platform.OS}</Text>
  //   <Text>8 Platform Version: {Platform.Version}</Text>
  //   <StatusBar style="auto" />
  // </View>
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      AppConsolelog("--status--", status);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert(
        "Notifications Blocked",
        "Notifications are currently blocked for our app. Please unblock our app in your Settings to receive alerts.",
        [
          {
            text: "Cancel",
          },
          {
            text: "Go to setting",
            onPress: () => {
              if (Platform.OS === "android") {
                const bundleIdentifier = Application.applicationId;
                IntentLauncher.startActivityAsync(
                  IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
                  {
                    data: `package:${bundleIdentifier}`,
                  }
                );
              }
              if (Platform.OS === "ios") {
                Linking.openURL("app-settings:");
              }
            },
          },
        ],
        { cancelable: true }
      );
      return;
    }

    token = (await Notifications.getDevicePushTokenAsync()).data;
    console.log("DevicePushToken: " + token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

async function post_data(endpoint: string, tdata: any) {
  let config = {};
  axiosInstance.post(endpoint, tdata, config);
}

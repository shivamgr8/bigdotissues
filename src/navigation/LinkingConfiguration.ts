/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */
import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../types";

//npx uri-scheme open "exp://192.168.2.156:19000/--/one" --android

const prefix = Linking.createURL("/");
console.info("Linking Config: " + prefix); // -- this URL is used to call screen from URL
//const linking: LinkingOptions<RootStackParamList> = {
let linking: LinkingOptions<any> = {
  prefixes: [prefix],
  config: {
    screens: {
      Home: {
        screens: {
          Root: {
            screens: {
              HomeCategoryTabs: {
                screens: {},
              },
              TimeDigest: {
                screens: {
                  TimeDigestScreen: "timedigest",
                },
              },
              Search: {
                screens: {
                  SearchScreen: "search",
                },
              },
              DigestTabs: {
                screens: {
                  DigestTabsScreen: "digest",
                },
              },
            },
          },
          Modal: "modal",
          NotFound: "*",
          PostsDetailList: "PostsDetailList/:postid",
          SourceListScreen: "SourceListScreen",
          NotificationsScreen: "notificationsscreen",
          CategoriesScreen: "categoriesscreen",
          ReorderCategoriesScreen: "reordercategoriesscreen",
          FontSizeScreen: "fontsizescreen",
          PolicyScreen: "policyscreen",
          TermsConditions: "termsconditions",
          Faq: "faq",
          AboutUs: "aboutus",
          Contact: "contact",
          Auth: {
            screens: {
              LoginScreen: "Login",
              ForgotPasswordScreen: "ForgotPassword",
              OtpScreen: "Otp",
              CreateAccountScreen: "CreateAccount",
              UpdateProfileComponent: "UpdateProfile",
              AccountScreen: "Account",
              UpdateEmailAddress: "UpdateEmail",
              UpdatePhoneNumber: "UpdatePhone",
              SetPassword: "SetPassword",
              Settings: "settings",
            },
          },
          "expo-auth-session": "expo-auth-session",
        },
      },
      BigdotAlerts: "bigdotalerts",
    },
  },
};

const getCategories = async () => {
  try {
    const value: any = await AsyncStorage.getItem("bigdot_categories");
    if (value !== null && value) {
      //console.log('Getting categories in Linking: '+value)
      let pitems = JSON.parse(JSON.parse(value));
      let tcnt = pitems.length;
      let tjson: any = {};
      Object.freeze(tjson);
      for (let i = 0; i < tcnt; i++) {
        //let ptitle = pitems[i].title
        let slug = pitems[i].title
          .toLowerCase()
          .replace(/ /g, "")
          .replace(/[^\w-]+/g, "");
        tjson = Object.assign({ [slug]: slug }, tjson);
      }
      // @ts-ignore
      linking.config.screens.HomeCategoryTabs = { screens: tjson };
      //console.log(linking.config?.screens?.Home?.screens?.categories)
    }
  } catch (e: any) {
    // error reading value
    console.log("error in linking configuration: " + e.message);
  }
};
getCategories();

export default linking;

/**
 * LeftDrawer "Navigator"
 *    Screen Name "Home" - RootNavigator
 *      Screen Name "Root" - BottomTabNavigator
 *          Screen Name "CategoryTabs"
 *          Screen Name "TabTwo"
 *          Screen Name "TabThree"
 *          Screen Name "TabFour"
 *      Screen Name "Settings" - SettingsScreen
 *      Screen Name "NotFound" - NotFoundScreen
 *      Screen Name "Modal" - ModalScreen
 *
 */

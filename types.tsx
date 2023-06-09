/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { KeyboardTypeOptions } from "react-native";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  //Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Root: any | undefined;
  Modal: undefined;
  NotFound: undefined;
  Settings: undefined;
  PostDetailNavigator: any | undefined;
  PostDetailScreen: any | undefined;
  PostsDetailList: any | undefined;
  SourceListScreen: any | undefined;
  notificationsscreen: any | undefined;
  categoriesscreen: any | undefined;
  ReorderCategoriesScreen: any | undefined;
  fontsizescreen: any | undefined;
  PolicyScreen: any | undefined;
  TermsConditions: any | undefined;
  Faq: any | undefined;
  AboutUs: any | undefined;
  Contact: any | undefined;
  Auth: any | undefined;
  Login: any | undefined;
  ForgotPassword: any | undefined;
  Otp: any | undefined;
  CreateAccount: any | undefined;
  UpdateProfileComponent: any | undefined;
  UpdateEmailAddress: any | undefined;
  UpdatePhoneNumber: any | undefined;
  SetPassword: any | undefined;
  ExpoAuthSession: any | undefined;
  Account: any | undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  TabOne: undefined;
  TimeDigest: undefined;
  TabThree: undefined;
  TabFour: undefined;
  CategoryTabs: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type authUserType = {
  uemail: string;
  uid: string;
  ptoken?: string;
  utype?: string;
  uname?: string;
  uphone?: string;
  ufname?: string;
  ulname?: string;
  ugender?: string;
  udob?: string;
  ucountrycode?: string;
  upic?: string;
  is_pwdset?: boolean;
};
export type authUserDetails = {
  uemail: string;
  uid: string;
  utype?: string;
  uname?: string;
  uphone?: string;
  ufname?: string;
  ulname?: string;
  ugender?: string;
  udob?: string;
  ucountrycode?: string;
  upic?: string;
  ispwdset?: boolean;
  ucountry: string;
  uiso2: string;
};

export interface itemType {
  sourceId: any;
  is_bookmark: boolean;
  story_of_the_hour: boolean;
  id: string;
  title: string;
  images: any;
  description: any;
  short_description: any;
  author: string;
  pubDate: string;
  source: string;
  is_trending: boolean;
  is_breaking: boolean;
  is_video: boolean;
  is_top_story: boolean;
  image_url: any;
  categoryId: string;
  icon: any;
  logo: any;
  read: number;
  audio: number;
  timeAgo: string;
}

export interface catObjType {
  category_image: string;
  id: string;
  title: string;
  icon: string;
  order: number;
  status: boolean;
}

export interface primaryInputType {
  style?: Object;
  indexFromStart?: number;
  onChange?: any;
  value?: string;
  placeholder?: string;
  label?: string;
  autoFocus?: boolean;
  keyboardType?: KeyboardTypeOptions | undefined;
  maxLength?: number;
  grayBg?: any;
  isError?: boolean;
  isPassword?: boolean;
  activeBlueBorder?: any;
  disable?: boolean;
  inputtype?: string;
  caretHidden?: boolean;
  defaultValue?: string;
  inputStyle?: Object;
  onDateIconPress?: () => void;
}

export interface sourceType {
  id: string;
  title: string;
  icon: string;
  logo: string;
  status: boolean;
}

import { FirebaseApp, initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { AuthSessionResult } from "expo-auth-session";
import { useEffect } from "react";

let fireBaseApp: FirebaseApp;
const configureFirebase = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyDFT5gQYFDuK2Pxntutehc0tG75TIBwZTk",
    projectId: "bigdot-ab1b4",
  };
  fireBaseApp = initializeApp(firebaseConfig);
  return fireBaseApp;
};
export const app = configureFirebase();

import React, { createContext, useEffect, useState, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Application from "expo-application";
import useColorScheme from "../hooks/useColorScheme";
import { storeAsyncData } from "./asyncStorage";

type PrefetchContextProvider = {
  children: React.ReactNode;
};
/*
type prefetchUserType = {
  ptoken: string
  uid: string
  uname: string
}
*/

type fontPropsType = {
  size: number;
  lineheight: number;
};

type TextSizeType = {
  text: fontPropsType;
  heading: fontPropsType;
};

type PrefetchContextType = {
  //pfData: prefetchUserType | {}
  //refreshData: any,
  theme: "light" | "dark" | "system";
  setTheme: any;
  textSize: TextSizeType;
  setFontSizes: any;
};

export const PrefetchContext = createContext<PrefetchContextType>(
  {} as PrefetchContextType
);

export const PrefetchContextProvider = ({
  children,
}: PrefetchContextProvider) => {
  //const [prefetchUser, setprefetchUser] = useState<prefetchUserType|{}>({} as prefetchUserType)
  const theme_name = useColorScheme();
  const [theme, setUserTheme] = useState<"light" | "dark" | "system">(
    theme_name
  );
  const [textSize, setTextSize] = useState<TextSizeType>({
    text: { size: 16, lineheight: 22 },
    heading: { size: 24, lineheight: 28 },
  });

  // const getTextSizes = async () => {
  //   try {
  //     const value: any = await AsyncStorage.getItem("bigdot_text_sizes");
  //     if (value !== null && value != undefined) {
  //       let tjson = JSON.parse(JSON.parse(value));
  //       setTextSize(tjson);
  //     }
  //   } catch (e) {
  //     console.log("Error loading cached Text Size from AsyncStorage");
  //     // error reading value
  //   }
  // };

  // useEffect(() => {
  //   //getTextSizes()
  //   console.info("Context updated: " + PrefetchContextProvider.name);
  //   console.info("prefect theme: " + theme);
  //   return () => {};
  // }, [theme]);

  const themeHandler = (themeObj: any) => {
    setUserTheme(themeObj);
    storeAsyncData(JSON.stringify(themeObj), "theme");
  };
  const fontSizeHandler = (tObj: TextSizeType) => {
    setTextSize(tObj);
  };

  const prefMemo = useMemo((): PrefetchContextType => {
    return {
      theme: theme,
      setTheme: themeHandler,
      textSize: textSize,
      setFontSizes: fontSizeHandler,
      /*pfData: prefetchUser, 
        refreshData: async(key:string):Promise<string> =>{
          
          try {
            const value = await AsyncStorage.getItem('bigdot_'+key)  
                   
            if(value !== null) {
              //console.info(value,"GET ASYNC STORAGE for: "+key)
              const c_val:prefetchUserType = JSON.parse(value)                                             
              setprefetchUser(c_val)              
            }
          } catch(e) {
            // error reading value
          }
          return 'true'          
        }*/
    };
  }, [theme, textSize]);
  /*
  const refreshData = async(key:string) =>{
    console.info('refresh data > '+key)
    try {
      const value = await AsyncStorage.getItem('bigdot_'+key)
      console.info('refresh data > '+value)          
      if(value !== null) {
        console.info(value,"GET ASYNC STORAGE for: "+key)
        const c_val:prefetchUserType = JSON.parse(value)                               
        setprefetchUser(c_val)
        console.info('refresh data > '+c_val)        
      }
    } catch(e) {
      // error reading value
    }
  }*/

  return (
    <PrefetchContext.Provider value={prefMemo}>
      {children}
    </PrefetchContext.Provider>
  );
};

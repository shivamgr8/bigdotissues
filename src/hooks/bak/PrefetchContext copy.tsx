import React, { createContext, useEffect, useState, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Application from "expo-application";

type PrefetchContextProvider = {
  children: React.ReactNode;
};
type prefetchUserType = {
  ptoken: string;
  uid: string;
  uname: string;
};
type PrefetchContextType = {
  prefetchUser: prefetchUserType | null;
  setprefetchUser: React.Dispatch<
    React.SetStateAction<prefetchUserType | null>
  >;
};

export const PrefetchContext = createContext<PrefetchContextType>(
  {} as PrefetchContextType
);

export const PrefetchContextProvider = ({
  children,
}: PrefetchContextProvider) => {
  const [prefetchUser, setprefetchUser] = useState<prefetchUserType | null>(
    {} as prefetchUserType
  );

  const authMemo = useMemo<any>(() => {
    /*async(key:string) =>{      
      try {
          const value = await AsyncStorage.getItem(key)
          if(value !== null) {
            console.info(value,"GET ASYNC STORAGE for: "+key)                   
            setprefetchData(value)
            return 'updated'
          }
        } catch(e) {
          // error reading value
      }*/
    getData: pfData: () => {
      return prefetchUser;
    };
  }, []);

  return (
    <PrefetchContext.Provider value={{ prefetchUser, setprefetchUser }}>
      {children}
    </PrefetchContext.Provider>
  );
};

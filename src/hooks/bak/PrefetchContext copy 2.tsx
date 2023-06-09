import React,{createContext, useEffect, useState, useMemo} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';

type PrefetchContextProvider={
  children:React.ReactNode
}
type prefetchUserType = {
  ptoken: string
  uid: string
  uname: string
}
type PrefetchContextType = {
  prefetchUser: prefetchUserType | null
  setprefetchUser: React.Dispatch<React.SetStateAction<prefetchUserType | null>>
  refreshData:any
}

export const PrefetchContext = createContext<PrefetchContextType>({} as PrefetchContextType);

export const PrefetchContextProvider = ({children}:PrefetchContextProvider) => {  
  const [prefetchUser, setprefetchUser] = useState<prefetchUserType|null>({} as prefetchUserType)
  

  const authMemo = useMemo<any>(() => {
    getData: async(key:string) =>{      
      try {
          const value = await AsyncStorage.getItem(key)          
          if(value !== null) {
            console.info(value,"GET ASYNC STORAGE for: "+key)
            const c_val:prefetchUserType = JSON.parse(value)                               
            setprefetchUser(c_val)
            return 'updated'
          }
        } catch(e) {
          // error reading value
        }
      }      
    pfData: () => {         
        return prefetchUser
      };         
    
  }, [prefetchUser])

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
  }

  return (
    <PrefetchContext.Provider value={{prefetchUser, setprefetchUser, refreshData}}>
      {children}
    </PrefetchContext.Provider>
  );
}



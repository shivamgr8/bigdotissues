import React,{createContext, useEffect, useState, useMemo} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';

type AlertContextProvider={
  children:React.ReactNode
}

type AlertContextType = {  
  setAlert:any,
  alert_str:string,  
}

export const AlertContext = createContext<AlertContextType>({} as AlertContextType);

export const AlertContextProvider = ({children}:AlertContextProvider) => {  
  const [alert_name, setAlertText] = useState('')
  
  useEffect(() => {    
    return () => {
    }
  }, [alert_name])
      

  const authMemo = useMemo(():AlertContextType => {
    return ({
        alert_str: alert_name ,
        setAlert:(tstr:string)=>{setAlertText(tstr)},                      
      }
    )
  }, [alert_name]) 

  return (
    <AlertContext.Provider value={authMemo}>
      {children}
    </AlertContext.Provider>
  );
}



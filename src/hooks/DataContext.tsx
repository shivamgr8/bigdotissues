import React,{createContext, useEffect, useState, useMemo} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';

type DataContextProvider={
  children:React.ReactNode
}
type DataUserType = {
  ptoken: string
  uid: string
  uname: string
}
type DataContextType = {  
  pfData: DataUserType | {}
  refreshData: any
}

export const DataContext = createContext<DataContextType>({} as DataContextType);

export const DataContextProvider = ({children}:DataContextProvider) => {  
  const [datajson, setjsonData] = useState<DataUserType|{}>({} as DataUserType)
  
  useEffect(() => {    
    console.info('Use Effect in: ' + DataContextProvider.name)
    return () => {      
    }
  }, [datajson])
  

  const authMemo = useMemo(():DataContextType => {
    return ({
        pfData: datajson
        , 
        refreshData: async(key:string):Promise<string> =>{
          
          try {
            const value = await AsyncStorage.getItem('bigdot_'+key)  
                   
            if(value !== null) {
              //console.info(value,"GET ASYNC STORAGE for: "+key)
              const c_val:DataUserType = JSON.parse(value)                                             
              setjsonData(c_val)              
            }
          } catch(e) {
            // error reading value
          }
          return 'true'          
        }      
      }       
    )
  }, [datajson])
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
    <DataContext.Provider value={authMemo}>
      {children}
    </DataContext.Provider>
  );
}



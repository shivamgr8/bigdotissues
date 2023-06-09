import { useEffect, useState, useReducer } from 'react';

const ACTIONS={
    SAVE:'SAVE',
    RESET:'RESET'
}
function reducer(prefetchData:any,action:any):any{
    if(action.type==ACTIONS.SAVE){
        return [...prefetchData, action.payload]
    }
    if(action.type==ACTIONS.RESET){
        return []
    }
}

const reducerHook = () =>{
    const [prefetchData, dispatch] = useReducer(reducer, [])

    function saveAS(tval:string){
        dispatch({type:ACTIONS.SAVE, payload:tval})
    }
    function resetAS(){
        dispatch({type:ACTIONS.RESET})
    }

    useEffect( () => {
        saveAS('Hello')
            
      return () => {   }
    }, [])
    
}

export default reducerHook;
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, createContext, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { resetLogedInUserInfo } from '../redux/slicers/loginSlicer';

export const AuthContext = createContext();

export const AuthProvider = (props) => { 
    //pass value to any screen of the app
    const [test, setTest] = useState('Test Val');
    const dispatch = useDispatch();
    const [userToken, setUserToken] = useState(null);

    const login =(token)=>{
        // console.log(payload,'>>>>>');
        // setUserToken('ftft')
        setUserToken(token)
        AsyncStorage.setItem('userToken', token);
    }
    const logout =()=>{
        // console.log('log out');
        dispatch(resetLogedInUserInfo())
        setUserToken(null)
        AsyncStorage.removeItem('userToken');
    }
    
    const isLoggedIn =()=>{
        // console.log('log out');
        AsyncStorage.getItem("userToken").then(value => {
            // console.log(value, 'userData----');
            setUserToken(value)
        });
    }

    useEffect(() => {
        isLoggedIn()
    }, [])
    
    
    
    return (
        // <AuthContext.Provider value={test}>
        <AuthContext.Provider value={{login,logout, userToken, test}}>
            {/* {childern} */}
             {props.children}
        </AuthContext.Provider>
    )
}

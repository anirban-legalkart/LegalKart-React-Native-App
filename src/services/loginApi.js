import axiosInstance from "./axiosInstance";
import * as URL from '../config/apiUrls';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const callLoginApi = async (payload) => {
    // console.log('callLoginApi------==',URL.USER_LOGIN_API )
    const {data = {}} = await axiosInstance.post(URL.USER_LOGIN_API, payload); //if we dont recive any respons then it give rspons like this data = {}
    payload?.login_type == "email" && AsyncStorage.setItem("_csrf", data._csrf);
    payload?.login_type == "email" && AsyncStorage.setItem('userToken', data.token)

    console.log(data,'data --')
    return data;
}
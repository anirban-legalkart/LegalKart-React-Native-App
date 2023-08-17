import axiosInstance from "./axiosInstance";
import * as URL from '../config/apiUrls';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {decode as atob, encode as btoa} from 'base-64'

const getAsyncStorageCsrfInfo = async () => {
    const csrf = await AsyncStorage.getItem('_csrf');
    return csrf;
  }

export const callViewLawyerProfileDetailsApi = async () => {
        
        const get_fcm = "Development";
        const get_csrf = await getAsyncStorageCsrfInfo();
        const finalCSRF = `${btoa(new Date().getTime().toString())}||${get_csrf}`;
        const jwt= `?_ptoken=${get_fcm}&_stoken=${finalCSRF}`;

        // console.log(URL.VIEW_LAWER_PROFILE_API + jwt ,'Url  ----')
        
        const {data = {}} = await axiosInstance.get(URL.VIEW_LAWER_PROFILE_API + jwt ); //if we dont recive any respons then it give rspons like this data = {}
    //    console.log(data,'callViewLawyerProfileDetailsApi ---->>>')

    return data;
}

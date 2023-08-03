import axiosInstance from "./axiosInstance";
import * as URL from '../config/apiUrls';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {decode as atob, encode as btoa} from 'base-64'

const getAsyncStorageCsrfInfo = async () => {
    const csrf = await AsyncStorage.getItem('_csrf');
    return csrf;
  }

export const callgetTalkZoneDetailsApi = async (payload) => {
        
        const get_fcm = "Development";
        const get_csrf = await getAsyncStorageCsrfInfo();
        const finalCSRF = `${btoa(new Date().getTime().toString())}||${get_csrf}`;
        const jwt= `?_ptoken=${get_fcm}&_stoken=${finalCSRF}`;

        // console.log(URL.GET_TALK_ZONE_DETAILS_API(payload?.page , payload?.limitItem) ,'Url  1st----')
        
        const {data = {}} = await axiosInstance.get(URL.GET_TALK_ZONE_DETAILS_API(payload?.page , payload?.limitItem) + jwt ); //if we dont recive any respons then it give rspons like this data = {}
      //  console.log(data,'callgetTalkZoneDetailsApi ---->>>')

    return data;
}

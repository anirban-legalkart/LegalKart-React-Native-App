import axiosInstance from "./axiosInstance";
import * as URL from '../config/apiUrls';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { decode as atob, encode as btoa } from 'base-64'

const getAsyncStorageCsrfInfo = async () => {
  const csrf = await AsyncStorage.getItem('_csrf');
  return csrf;
}

export const callGetScheduleCallListDetailsApi = async (payload) => {
  // console.log(payload ,'payload 12345  ----')

  const get_fcm = "Development";
  const get_csrf = await getAsyncStorageCsrfInfo();
  const finalCSRF = `${btoa(new Date().getTime().toString())}||${get_csrf}`;
  const jwt = `?_ptoken=${get_fcm}&_stoken=${finalCSRF}`;

  const scheduleCallType = `&schedule_type=${payload?.scheduleCallType}`;
  // console.log(URL.GET_SCHEDULE_CALL_LIST_API(payload?.page) +  scheduleCallType ,'Url  2nd----')

  const { data = {} } = await axiosInstance.get(URL.GET_SCHEDULE_CALL_LIST_API(payload?.page) + jwt + scheduleCallType); //if we dont recive any respons then it give rspons like this data = {}
    //  console.log(data,'callGetScheduleCallListDetailsApi ---->>>')

  return data;
}

import axiosInstance from "./axiosInstance";
import * as URL from '../config/apiUrls';
import {decode as atob, encode as btoa} from 'base-64'



export const callVerifyOTPApi= async (payload) => {
    console.log('callVerifyOTPApi',URL.VERIFY_OTP_API,'----', payload )
    
        const get_fcm = "Development";
        const get_csrf = payload?._csrf;
        const finalCSRF = `${btoa(new Date().getTime().toString())}||${get_csrf}`;
        const jwt= `?_ptoken=${get_fcm}&_stoken=${finalCSRF}`;
    
    
    const {data = {}} = await axiosInstance.post(URL.VERIFY_OTP_API + jwt , payload); //if we dont recive any respons then it give rspons like this data = {}
    console.log(data)
    return data;
}


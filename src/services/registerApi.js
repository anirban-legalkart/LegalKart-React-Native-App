import axiosInstance from "./axiosInstance";
import * as URL from '../config/apiUrls';

export const callRegisterApi = async (payload) => {
    // console.log('callRegisterApi------==',URL.USER_REGISTER_API )
    const {data = {}} = await axiosInstance.post(URL.USER_REGISTER_API, payload); //if we dont recive any respons then it give rspons like this data = {}
    console.log(data,'data RegisterApi --')
    return data;
}
import { call, put, takeLatest } from 'redux-saga/effects';
import { onVerifyRegisterOTPSubmit, onVerifyRegisterOTPSubmitSuccess,  onVerifyRegisterOTPSubmitError } from "../slicers/verifyRegisterPhoneOTPSlicer";

import { callVerifyRegisterOTPApi } from '../../services/registerOTPVerifyApi';



function* doVerifyRegisterOTP({ payload }) {
    
//    console.log('1234567890123456789023456789', payload)
    if (payload) {  //if i have to send any query , or want to send any data then i have to pass the paylod aloso  yield call(callgetAllCategoriesApi,payload)
        try {
            const getVerifyRegisterOTPResponse = yield call(callVerifyRegisterOTPApi,payload);
            // console.log("-=-=-= >>> ", getVerifyRegisterOTPResponse) //after receving response from api we have to call the onUserExistSubmitSuccess(userExistResponse) action 
            yield put(onVerifyRegisterOTPSubmitSuccess(getVerifyRegisterOTPResponse)) //after passing we can check it in slicer/loginSlicer.js & console it
        } catch {
            const message = 'something went wrong';
            yield put(onVerifyRegisterOTPSubmitError({ message }))
        }
    }
}

export default function* verifyRegisterPhoneOTPSaga() { //this is a saga watcher function 
    yield takeLatest(onVerifyRegisterOTPSubmit.type, doVerifyRegisterOTP);
}

/*
call :- allows us to call urls && apis
put :-  allows us to call our actions
*/
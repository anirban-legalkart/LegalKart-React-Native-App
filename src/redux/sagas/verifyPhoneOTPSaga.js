import { call, put, takeLatest } from 'redux-saga/effects';
import { onVerifyOTPSubmit, onVerifyOTPSubmitSuccess,  onVerifyOTPSubmitError } from "../slicers/verifyPhoneOTPSlicer";

import { callVerifyOTPApi } from './../../services/phoneOTPVerifyApi';



function* doVerifyOTP({ payload }) {
    
//    console.log('1234567890123456789023456789', payload)
    if (payload) {  //if i have to send any query , or want to send any data then i have to pass the paylod aloso  yield call(callgetAllCategoriesApi,payload)
        try {
            const getVerifyOTPResponse = yield call(callVerifyOTPApi,payload);
            // console.log("-=-=-= >>> ", getVerifyOTPResponse) //after receving response from api we have to call the onUserExistSubmitSuccess(userExistResponse) action 
            yield put(onVerifyOTPSubmitSuccess(getVerifyOTPResponse)) //after passing we can check it in slicer/loginSlicer.js & console it
        } catch {
            const message = 'something went wrong';
            yield put(onVerifyOTPSubmitError({ message }))
        }
    }
}

export default function* verifyPhoneOTPSaga() { //this is a saga watcher function 
    yield takeLatest(onVerifyOTPSubmit.type, doVerifyOTP);
}

/*
call :- allows us to call urls && apis
put :-  allows us to call our actions
*/
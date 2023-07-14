import { call, put, takeLatest } from 'redux-saga/effects';
import { onResendOTPSubmit, onResendOTPSubmitSuccess,  onResendOTPSubmitError } from "../slicers/resendPhoneOTPSlicer";

import { callResendOTPApi } from '../../services/resendPhoneOTPApi';



function* doResendOTP({ payload }) {
    
//    console.log('1234567890123456789023456789', payload)
    if (payload) {  //if i have to send any query , or want to send any data then i have to pass the paylod aloso  yield call(callgetAllCategoriesApi,payload)
        try {
            const getResendOTPResponse = yield call(callResendOTPApi,payload);
            // console.log("-=-=-= >>> ", getResendOTPResponse) //after receving response from api we have to call the onUserExistSubmitSuccess(userExistResponse) action 
            yield put(onResendOTPSubmitSuccess(getResendOTPResponse)) //after passing we can check it in slicer/loginSlicer.js & console it
        } catch {
            const message = 'something went wrong';
            yield put(onResendOTPSubmitError({ message }))
        }
    }
}

export default function* resendPhoneOTPSaga() { //this is a saga watcher function 
    yield takeLatest(onResendOTPSubmit.type, doResendOTP);
}

/*
call :- allows us to call urls && apis
put :-  allows us to call our actions
*/
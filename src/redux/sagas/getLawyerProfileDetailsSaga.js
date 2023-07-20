import { call, put, takeLatest } from 'redux-saga/effects';
import { onGetLawyerProfileDetailsSubmit, onGetLawyerProfileDetailsSubmitSuccess, onGetLawyerProfileDetailsSubmitError } from "../slicers/getLawyerProfileDetailsSlicer";

import { callgetLawyerProfileDetailsApi } from './../../services/getLawyerProfileDetailsApi';

function* doGetLawyerProfileDetails({ payload }) {
    
    // console.log('1234567890123456789023456789', payload)
    // if (payload) {
        try {
            const getLawyerProfileDetailsResponse = yield call(callgetLawyerProfileDetailsApi);
            // console.log("-=-=-= >>> 1", getLawyerProfileDetailsResponse) //after receving response from api we have to call the onUserExistSubmitSuccess(userExistResponse) action 
            yield put(onGetLawyerProfileDetailsSubmitSuccess(getLawyerProfileDetailsResponse)) //after passing we can check it in slicer/loginSlicer.js & console it
        } catch {
            const message = 'something went wrong';
            yield put(onGetLawyerProfileDetailsSubmitError({ message }))
        }
    // }
}

export default function* getLawyerProfileDetailsSaga() { //this is a saga watcher function 
    yield takeLatest(onGetLawyerProfileDetailsSubmit.type, doGetLawyerProfileDetails);
}

/*
call :- allows us to call urls && apis
put :-  allows us to call our actions
*/
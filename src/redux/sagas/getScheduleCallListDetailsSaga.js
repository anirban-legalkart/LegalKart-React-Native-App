import { call, put, takeLatest } from 'redux-saga/effects';
import { onGetScheduleCallListDetailsSubmit, onGetScheduleCallListDetailsSubmitSuccess, onGetScheduleCallListDetailsSubmitError  } from "../slicers/getScheduleCallListDetailsSlicer";

import { callGetScheduleCallListDetailsApi } from '../../services/getScheduleCallListDetailsApi';

function* doGetScheduleCallListDetails({ payload }) {
    
    // console.log('1234567890123456789023456789', payload)
    if (payload) {
        try {
            const getScheduleCallListDetailsResponse = yield call(callGetScheduleCallListDetailsApi, payload);
            // console.log("-=-=-= >>> 1", getLawyerProfileDetailsResponse) //after receving response from api we have to call the onUserExistSubmitSuccess(userExistResponse) action 
            yield put(onGetScheduleCallListDetailsSubmitSuccess(getScheduleCallListDetailsResponse)) //after passing we can check it in slicer/loginSlicer.js & console it
        } catch {
            const message = 'something went wrong';
            yield put(onGetScheduleCallListDetailsSubmitError({ message }))
        }
    }
}

export default function* getScheduleCallListDetailsSaga() { //this is a saga watcher function 
    yield takeLatest(onGetScheduleCallListDetailsSubmit.type, doGetScheduleCallListDetails);
}

/*
call :- allows us to call urls && apis
put :-  allows us to call our actions
*/
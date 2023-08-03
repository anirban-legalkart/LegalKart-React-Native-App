import { call, put, takeLatest } from 'redux-saga/effects';
import { onGetTalkZoneDetailsSubmit, onGetTalkZoneDetailsSubmitSuccess, onGetTalkZoneDetailsSubmitError } from "../slicers/getTalkZoneDetailsSlicer";

import { callgetTalkZoneDetailsApi } from '../../services/getTalkZoneDetailsApi';

function* doGetTalkZoneDetails({ payload }) {
    
    // console.log('1234567890123456789023456789', payload)
    if (payload) {
        try {
            const getTalkZoneDetailsResponse = yield call(callgetTalkZoneDetailsApi, payload);
            // console.log("-=-=-= >>> 1", getTalkZoneDetailsResponse) //after receving response from api we have to call the onUserExistSubmitSuccess(userExistResponse) action 
            yield put(onGetTalkZoneDetailsSubmitSuccess(getTalkZoneDetailsResponse)) //after passing we can check it in slicer/loginSlicer.js & console it
        } catch {
            const message = 'something went wrong';
            yield put(onGetTalkZoneDetailsSubmitError({ message }))
        }
    }
}

export default function* getTalkZoneDetailsSaga() { //this is a saga watcher function 
    yield takeLatest(onGetTalkZoneDetailsSubmit.type, doGetTalkZoneDetails);
}

/*
call :- allows us to call urls && apis
put :-  allows us to call our actions
*/
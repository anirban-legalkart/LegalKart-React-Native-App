import { call, put, takeLatest } from 'redux-saga/effects';
import { onGetTakeCallStatusSubmit, onGetTakeCallStatusSubmitSuccess, onGetTakeCallStatusSubmitError } from "../slicers/getTakeCallStatusSlicer";

import { callGetTakeCallStatusApi } from '../../services/getTakeCallStatusApi';

function* doGetTakeCallStatus({ payload }) {
    
    // console.log('1234567890123456789023456789', payload)
    // if (payload) {
        try {
            const getTakeCallStatusResponse = yield call(callGetTakeCallStatusApi);
            // console.log("-=-=-= >>> 1", getTakeCallStatusResponse) //after receving response from api we have to call the onUserExistSubmitSuccess(userExistResponse) action 
            yield put(onGetTakeCallStatusSubmitSuccess(getTakeCallStatusResponse)) //after passing we can check it in slicer/loginSlicer.js & console it
        } catch {
            const message = 'something went wrong';
            yield put(onGetTakeCallStatusSubmitError({ message }))
        }
    // }
}

export default function* getTakeCallStatusSaga() { //this is a saga watcher function 
    yield takeLatest(onGetTakeCallStatusSubmit.type, doGetTakeCallStatus);
}

/*
call :- allows us to call urls && apis
put :-  allows us to call our actions
*/
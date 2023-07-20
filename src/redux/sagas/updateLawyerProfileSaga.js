import { call, put, takeLatest } from 'redux-saga/effects';
import { onUpdateLawyerProfileSubmit, onUpdateLawyerProfileSubmitSuccess, onUpdateLawyerProfileSubmitError } from "../slicers/updateLawyerProfileSlicer";
import { callUpdateLawyerProfileApi } from '../../services/updateLawyerProfileApi';

function* doUpdateProfile({ payload }) {
    // const { query } = payload;
    // console.log(payload,'1234567890')
    if (payload) {
        try {
            const updateProfileResponse = yield call(callUpdateLawyerProfileApi, payload);
            // console.log("-=-=-= >>> 1", updateProfileResponse) //after receving response from api we have to call the onUpdateLawyerProfileSubmitSuccess(updateProfileResponse) action 
            yield put(onUpdateLawyerProfileSubmitSuccess(updateProfileResponse)) //after passing we can check it in slicer/loginSlicer.js & console it
        } catch {
            const message = 'something went wrong';
            yield put(onUpdateLawyerProfileSubmitError({ message }))
        }
    }
}

export default function* updateLawyerProfileSaga() { //this is a saga watcher function 
    yield takeLatest(onUpdateLawyerProfileSubmit.type, doUpdateProfile);
}

/*
call :- allows us to call urls && apis
put :-  allows us to call our actions
*/
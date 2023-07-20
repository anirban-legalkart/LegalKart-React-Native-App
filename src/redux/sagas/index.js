// here we manage multiple saga files && // 7th go to store.js & import rootSaga and call sagaMiddleware.run(rootSaga)
import { all } from "redux-saga/effects";
import loginSaga from "./loginSaga";
import verifyPhoneOTPSaga from "./verifyPhoneOTPSaga";
import registerSaga from "./registerSaga";
import verifyRegisterPhoneOTPSaga from "./verifyRegisterPhoneOTPSaga";
import resendPhoneOTPSaga from "./resendPhoneOTPSaga";
import getLawyerProfileDetailsSaga from "./getLawyerProfileDetailsSaga";
import updateLawyerProfileSaga from "./updateLawyerProfileSaga";


export default function* rootSaga() {
    yield all([
        loginSaga(),
        verifyPhoneOTPSaga(),
        registerSaga(),
        verifyRegisterPhoneOTPSaga(),
        resendPhoneOTPSaga(),
        getLawyerProfileDetailsSaga(),
        updateLawyerProfileSaga(),
    ]);
}



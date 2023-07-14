//in store reducer we manage multiple reducers ; 5th go to store.js & import reducers & pass it into reducer: reducers,
// 6th go to sagas folder & write the saga logic

import loginReducer from "./slicers/loginSlicer"; //using this export default  grabbing  loginSlicer.reducer;
import verifyPhoneOTPReducer from "./slicers/verifyPhoneOTPSlicer"; 
import registerReducer from "./slicers/registerSlicer"; 
import verifyRegisterPhoneOTPReducer from "./slicers/verifyRegisterPhoneOTPSlicer"; 
import resendPhoneOTPReducer from "./slicers/resendPhoneOTPSlicer"; 

const reducers = {
    loginReducer: loginReducer,
    verifyPhoneOTPReducer: verifyPhoneOTPReducer,
    registerReducer: registerReducer,
    verifyRegisterPhoneOTPReducer: verifyRegisterPhoneOTPReducer,
    resendPhoneOTPReducer: resendPhoneOTPReducer,
   
}

export default reducers;
//here we write action, reducer ; 3rd go to storeReducers & imports loginSlicer.reducer & mentioned it in reducers{... }
import { createSlice } from '@reduxjs/toolkit';

export const verifyRegisterPhoneOTPSlicer = createSlice({ //whole slicer
    name: 'registerPhoneOTPVerify', //this is the name of reducer
    initialState: {
        isLoading: false,
        isError: false,
        data: {}, //it's store all the respons from the api
        error: {}
    },
    reducers: { //different actions
        
        onVerifyRegisterOTPSubmit: (state) => {
            // console.log('1234567890..................',state)
            return { ...state, isLoading: true, data: {} , isError: false }
        },
        onVerifyRegisterOTPSubmitSuccess: (state, { payload }) => {
            // console.log('fffff 1234567890..................', state, payload)  //consolig the respons comming from sagas/loginSaga.js
            return { ...state, isLoading: false, isError: false, data: payload }
        },
        onVerifyRegisterOTPSubmitError: (state, { payload }) => {
            return { ...state, isLoading: false, isError: true, error: payload }
        }
    }
})

export const { onVerifyRegisterOTPSubmit, onVerifyRegisterOTPSubmitSuccess,  onVerifyRegisterOTPSubmitError
} = verifyRegisterPhoneOTPSlicer.actions; 

export default verifyRegisterPhoneOTPSlicer.reducer; // this is reducer (it alows us to grab the reducer)



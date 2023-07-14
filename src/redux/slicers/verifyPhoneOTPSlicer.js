//here we write action, reducer ; 3rd go to storeReducers & imports loginSlicer.reducer & mentioned it in reducers{... }
import { createSlice } from '@reduxjs/toolkit';

export const verifyPhoneOTPSlicer = createSlice({ //whole slicer
    name: 'phoneOTPVerify', //this is the name of reducer
    initialState: {
        isLoading: false,
        isError: false,
        data: {}, //it's store all the respons from the api
        error: {}
    },
    reducers: { //different actions
        
        onVerifyOTPSubmit: (state) => {
            // console.log('1234567890..................',state)
            return { ...state, isLoading: true, data: {} , isError: false }
        },
        onVerifyOTPSubmitSuccess: (state, { payload }) => {
            // console.log('fffff 1234567890..................', state, payload)  //consolig the respons comming from sagas/loginSaga.js
            return { ...state, isLoading: false, isError: false, data: payload }
        },
        onVerifyOTPSubmitError: (state, { payload }) => {
            return { ...state, isLoading: false, isError: true, error: payload }
        }
    }
})

export const { onVerifyOTPSubmit, onVerifyOTPSubmitSuccess,  onVerifyOTPSubmitError
} = verifyPhoneOTPSlicer.actions; 

export default verifyPhoneOTPSlicer.reducer; // this is reducer (it alows us to grab the reducer)



//here we write action, reducer ; 3rd go to storeReducers & imports loginSlicer.reducer & mentioned it in reducers{... }
import { createSlice } from '@reduxjs/toolkit';

export const getLawyerProfileDetailsSlicer = createSlice({ //whole slicer
    name: 'lawyerProfileDetails', //this is the name of reducer
    initialState: {
        isLoading: false,
        isError: false,
        data: {}, //it's store all the respons from the api ; if api respnose is comming in the from of array then i have to give [] & i have to change the thing in   onGetLawyerProfileDetailsSubmit: (state) => { data: [] } ; other wise if the response comming in the from of {} then i have to change it in obj.
        error: {}
    },
    reducers: { //different actions
        onGetLawyerProfileDetailsSubmit: (state) => {
            // console.log('1234567890.................. 2',state)
            return { ...state, isLoading: true, isError: false }
        },
        onGetLawyerProfileDetailsSubmitSuccess: (state, { payload }) => {
            // console.log('fffff 1234567890.................. 3', state, payload)  
           
            return { ...state, isLoading: false, isError: false, data: payload }
        },
        onGetLawyerProfileDetailsSubmitError: (state, { payload }) => {
            return { ...state, isLoading: false, isError: true, error: payload }
        }
    }
})

export const { onGetLawyerProfileDetailsSubmit, onGetLawyerProfileDetailsSubmitSuccess, onGetLawyerProfileDetailsSubmitError } = getLawyerProfileDetailsSlicer.actions; //this is action ; exporting all of the 3 actions from loginSlicer.actions= { onUserExistSubmit, ..... }

export default getLawyerProfileDetailsSlicer.reducer; // this is reducer (it alows us to grab the reducer)



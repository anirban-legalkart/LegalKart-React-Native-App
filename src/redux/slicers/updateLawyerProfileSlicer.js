//here we write action, reducer ; 3rd go to storeReducers & imports updateLawyerProfileSlicer.reducer & mentioned it in reducers{... }
import { createSlice } from '@reduxjs/toolkit';

export const updateLawyerProfileSlicer = createSlice({ //whole slicer
    name: 'lawyerProfile', //this is the name of reducer
    initialState: {
        isLoading: false,
        isError: false,
        data: null, //it's store all the respons from the api
        error: {}
    },
    reducers: { //different actions
        onUpdateLawyerProfileSubmit: (state) => {
            // console.log(state)
            return { ...state, isLoading: true, isError: false }
        },
        onUpdateLawyerProfileSubmitSuccess: (state, { payload }) => {
            // console.log('fffff 3', state, payload)  //consolig the respons comming from sagas/loginSaga.js
            return { ...state, isLoading: false, isError: false, data: payload }
        },
        onUpdateLawyerProfileSubmitError: (state, { payload }) => {
            return { ...state, isLoading: false, isError: true, error: payload }
        },

        // resetLogedInUserInfo: (state) => ({
		// 	...state,
		// 	data: null,
        //     message: null
		// }),
    }
})

export const { onUpdateLawyerProfileSubmit, onUpdateLawyerProfileSubmitSuccess, onUpdateLawyerProfileSubmitError } = updateLawyerProfileSlicer.actions; //this is action ; exporting all of the 3 actions from updateLawyerProfileSlicer.actions= { onUpdateLawyerProfileSubmit, ..... }

export default updateLawyerProfileSlicer.reducer; // this is reducer (it alows us to grab the reducer)
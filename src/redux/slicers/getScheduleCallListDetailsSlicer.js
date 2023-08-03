//here we write action, reducer ; 3rd go to storeReducers & imports loginSlicer.reducer & mentioned it in reducers{... }
import { createSlice } from '@reduxjs/toolkit';

export const getScheduleCallListDetailsSlicer = createSlice({ //whole slicer
    name: 'scheduleCallListDetails', //this is the name of reducer
    initialState: {
        isLoading: false,
        isError: false,
        data: {}, //it's store all the respons from the api ; if api respnose is comming in the from of array then i have to give [] & i have to change the thing in   onGetScheduleCallListDetailsSubmit: (state) => { data: [] } ; other wise if the response comming in the from of {} then i have to change it in obj.
        error: {}
    },
    reducers: { //different actions
        onGetScheduleCallListDetailsSubmit: (state) => {
            // console.log('1234567890.................. 2',state)
            return { ...state, isLoading: true, isError: false }
        },
        onGetScheduleCallListDetailsSubmitSuccess: (state, { payload }) => {
            // console.log('fffff 1234567890.................. 3', state, payload)  
           
            return { ...state, isLoading: false, isError: false, data: payload }
        },
        onGetScheduleCallListDetailsSubmitError: (state, { payload }) => {
            return { ...state, isLoading: false, isError: true, error: payload }
        },
        resetScheduleCallListInfo: (state) => ({
			...state,
			data: {},
            error: {}
		})
    }
})

export const { onGetScheduleCallListDetailsSubmit, onGetScheduleCallListDetailsSubmitSuccess, onGetScheduleCallListDetailsSubmitError, resetScheduleCallListInfo } = getScheduleCallListDetailsSlicer.actions; //this is action ; exporting all of the 3 actions from loginSlicer.actions= { onUserExistSubmit, ..... }

export default getScheduleCallListDetailsSlicer.reducer; // this is reducer (it alows us to grab the reducer)



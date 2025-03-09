import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
    accesstoken: string,
    _id: string
}

const authSlide = createSlice({
    name: 'auth',
    initialState: {
        data: {
            accesstoken: '',
            _id: ''
        }
    },
    reducers: {
        addAuth: (state, action) => {
            state.data = action.payload
        },
        removeAuth: (state, _action) => {
            state.data = {
                accesstoken: '',
                _id: ''
            }
        }
    }

})

export const authReducer = authSlide.reducer
export const {addAuth, removeAuth} = authSlide.actions
export const authSelector = (state: any ) => state.authReducer.data 
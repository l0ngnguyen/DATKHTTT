import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        email: null,
        userId: null,
        info: null,
    },
    reducers: {
        changeEmail: (state, action) => {
            state.email = action.payload
        },

        changeUserId: (state, action) => {
            state.userId = action.payload
        },
        changeUserInfo: (state, action) => {
            state.info = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { changeEmail, changeUserId, changeUserInfo } = userSlice.actions

export default userSlice.reducer
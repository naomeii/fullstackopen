import { createSlice } from '@reduxjs/toolkit'

// ------ createSlice
const notificationSlice = createSlice({
  name: 'anecdote',
  initialState: '',
  reducers: {
    createNotification(state, action) {
        const notification = action.payload
        return notification
    },
    clearNotification() {
        return ''
    }
  }

})

export const { clearNotification, createNotification } = notificationSlice.actions;

export default notificationSlice.reducer;

import { createSlice } from '@reduxjs/toolkit'

// ------ createSlice
const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification(state, action) {
        return action.payload
    },
  }

})

export const { setNotification } = notificationSlice.actions;

export const addNotification = ( message, seconds ) => {
  const milliseconds = seconds * 1000
  return async dispatch => {
    dispatch(setNotification(message))
    setTimeout(() => {
      dispatch(setNotification(null))
    }, milliseconds)
  }
}

export default notificationSlice.reducer;

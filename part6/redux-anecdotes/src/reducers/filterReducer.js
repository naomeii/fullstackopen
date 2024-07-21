import { createSlice } from '@reduxjs/toolkit'

// const filterReducer = (state = '', action) => {
//   switch (action.type) {
//     case 'SET_FILTER':
//       return action.payload
//     default:
//       return state
//   }
// }

// export const filterChange = input => {
//   return {
//     type: 'SET_FILTER',
//     payload: input,
//   }
// }

// takes in a name, initialstate, reducers
// dispatch(filterChange('abc')) becomes
// dispatch({ type: 'filter/filterChange', payload: 'abc' })
// dispatch({ type: 'name/reducer', payload: 'abc' })
const filterSlice = createSlice({
  name: 'filter',
  initialState: '', // Initial state
  reducers: {
    filterChange(state, action) {
      return action.payload;
    },
  },
});


export const { filterChange } = filterSlice.actions
export default filterSlice.reducer
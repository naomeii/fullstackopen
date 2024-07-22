import { createSlice, current } from '@reduxjs/toolkit'
import noteService from '../services/notes'

// takes in a name, initialstate, reducers
// dispatch(createNote('Redux Toolkit is awesome!')) becomes
// dispatch({ type: 'notes/createNote', payload: 'Redux Toolkit is awesome!' })
// dispatch({ type: 'name/reducer', payload: 'Redux Toolkit is awesome!' })
const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    toggleImportanceOf(state, action) {
      const id = action.payload
      const noteToChange = state.find(n => n.id === id)
      const changedNote = { 
        ...noteToChange, 
        important: !noteToChange.important 
      }

      // console.log(current(state))

      return state.map(note =>
        note.id !== id ? note : changedNote 
      )     
    },
    appendNote(state, action) {
      state.push(action.payload)
    },
    setNotes(state, action) {
      return action.payload
    }
  },
})

export const { toggleImportanceOf, appendNote, setNotes } = noteSlice.actions

export const initializeNotes = () => {
  return async dispatch => {
    const notes = await noteService.getAll()
    dispatch(setNotes(notes))
  }
}

export const createNote = content => {
  return async dispatch => {
    const newNote = await noteService.createNew(content)
    dispatch(appendNote(newNote))
  }
}

export default noteSlice.reducer

// const noteReducer = (state = initialState, action) => {
//     switch(action.type) {

//       case 'NEW_NOTE':
//         // state.push(action.payload) vioates reducers being pure functions. cannot change the state
//         // return state.concat(action.payload) // creates a new array of old + new element
//         return [...state, action.payload] // same as concat
//         // given numbers = [1, 2, 3], [...numbers, 4, 5] -> [1, 2, 3, 4 ,5]
//         // [numbers, 4, 5] ->  [1, 2, 3], 4, 5] 

//       case 'TOGGLE_IMPORTANCE': {
//         const id = action.payload.id
//         const noteToChange = state.find(n => n.id === id)
//         const changedNote = { 
//           ...noteToChange, 
//           important: !noteToChange.important 
//         }
//         // not changing state directly. creates a copy and replaces the desired note to be changed
//         return state.map(note =>
//           note.id !== id ? note : changedNote 
//         )
//         }

//       default:
//         return state
//     }
//   }

// const generateId = () =>
//   Number((Math.random() * 1000000).toFixed(0))

// // separate creating actions into separate functions (action creator)
// export const createNote = (content) => {
//     return {
//       type: 'NEW_NOTE',
//       payload: {
//         content,
//         important: false,
//         id: generateId()
//       }
//     }
//   }
  
// export const toggleImportanceOf = (id) => {
//     return {
//       type: 'TOGGLE_IMPORTANCE',
//       payload: { id }
//     }
//   }

// export default noteReducer
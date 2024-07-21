const initialState = [
  {
    content: 'reducer defines how redux store works',
    important: true,
    id: 1,
  },
  {
    content: 'state of store can contain any data',
    important: false,
    id: 2,
  },
]

const noteReducer = (state = initialState, action) => {
    switch(action.type) {

      case 'NEW_NOTE':
        // state.push(action.payload) vioates reducers being pure functions. cannot change the state
        // return state.concat(action.payload) // creates a new array of old + new element
        return [...state, action.payload] // same as concat
        // given numbers = [1, 2, 3], [...numbers, 4, 5] -> [1, 2, 3, 4 ,5]
        // [numbers, 4, 5] ->  [1, 2, 3], 4, 5] 

      case 'TOGGLE_IMPORTANCE': {
        const id = action.payload.id
        const noteToChange = state.find(n => n.id === id)
        const changedNote = { 
          ...noteToChange, 
          important: !noteToChange.important 
        }
        // not changing state directly. creates a copy and replaces the desired note to be changed
        return state.map(note =>
          note.id !== id ? note : changedNote 
        )
        }

      default:
        return state
    }
  }

const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))

// separate creating actions into separate functions (action creator)
export const createNote = (content) => {
    return {
      type: 'NEW_NOTE',
      payload: {
        content,
        important: false,
        id: generateId()
      }
    }
  }
  
export const toggleImportanceOf = (id) => {
    return {
      type: 'TOGGLE_IMPORTANCE',
      payload: { id }
    }
  }

export default noteReducer
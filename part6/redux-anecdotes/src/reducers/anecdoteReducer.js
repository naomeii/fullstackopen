import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

// const anecdotesAtStart = [
//   'If it hurts, do it more often',
//   'Adding manpower to a late software project makes it later!',
//   'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
//   'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
//   'Premature optimization is the root of all evil.',
//   'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
// ]

// const getId = () => (100000 * Math.random()).toFixed(0)

// const asObject = (anecdote) => {
//   return {
//     content: anecdote,
//     id: getId(),
//     votes: 0
//   }
// }

// const initialState = anecdotesAtStart.map(asObject)

// ------ createSlice
const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
    // addVote(state, action) {
    //   // console.log(current(state), action)
    //   const anecdoteToVoteFor = state.find(anecdote => anecdote.id === action.payload.id)
    //   const votedAnecdote = {...anecdoteToVoteFor, votes: anecdoteToVoteFor.votes + 1}

    //   const newState = [...state.filter(a => a.id !== action.payload.id), votedAnecdote]
    //   return newState.sort((a1, a2) => a2.votes - a1.votes)
    // },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }

})

export const { addVote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteRequest = anecdote => {
  return async dispatch => {
    const votedAnecdote = {...anecdote, votes: anecdote.votes + 1}
    await anecdoteService.vote(votedAnecdote)
    dispatch(initializeAnecdotes())
  }
}

export default anecdoteSlice.reducer;


// // ACTION CREATORS -------------------------
// export const createAnecdote = (content) => {
//   return {
//     type: 'NEW_ANECDOTE',
//     payload: {
//       content,
//       id: getId(),
//       votes: 0
//     }
//   }
// }

// export const addVote = (id) => {
//   return {
//     type: 'ADD_VOTE',
//     payload: { id }
//   }
// }

// // -----------------------------------------

// const reducer = (state = initialState, action) => {
//   // console.log('state now: ', state)
//   // console.log('action', action)

//   switch (action.type) {
//     case 'ADD_VOTE': {
//       const anecdoteToVoteFor = state.find(anecdote => anecdote.id === action.payload.id)
//       const votedAnecdote = {...anecdoteToVoteFor, votes: anecdoteToVoteFor.votes + 1}

//       const newState = [...state.filter(a => a.id !== action.payload.id), votedAnecdote]

//       return newState.sort((a1, a2) => a2.votes - a1.votes)
//     }
//     case 'NEW_ANECDOTE': {
//       return [...state, action.payload].sort((a1, a2) => a2.votes - a1.votes)
//     }
//     default:
//       return state.sort((a1, a2) => a2.votes - a1.votes)
//   }
// }

// export default reducer
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'

import { useEffect } from 'react'
import { initializeAnecdotes } from './reducers/anecdoteReducer'
import { useDispatch } from 'react-redux'

const App = () => {
  //   // allows all components to make changes to the state of the Redux store
//   const dispatch = useDispatch() // provides any React Component access to dispatch function of the Redux store defined in main.jsx.
//   const notes = useSelector(state => state) // component (App) can access the notes in the store with useSelector hook
//   // useSelector receives a function as a parameter. It either searches for or selects data from the Redux store
//   // state => state since we need ALL notes (aka the whole state)
//   //const importantNotes = useSelector(state => state.filter(note => note.important))  would return only the important notes
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAnecdotes())
  },[])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App
import NewNote from "./components/NewNote"
import Notes from "./components/Notes"
import VisibilityFilter from "./components/Visibility"

import { useEffect } from 'react'
import { initializeNotes } from './reducers/noteReducer'
import { useDispatch } from 'react-redux'

const App = () => {
  const dispatch = useDispatch()
  // // fetching data from the server
  // useEffect(() => {
  //   noteService
  //     .getAll().then(notes => dispatch(setNotes(notes)))
  // }, [])
  useEffect(() => {
    dispatch(initializeNotes()) // we abstracted the above. initialization logic has been completely separated from this react component.
  }, []) 


  return (
    <div>
      <NewNote />
      <VisibilityFilter />
      <Notes />
    </div>
  )
}

export default App
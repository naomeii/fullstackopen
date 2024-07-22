import { useDispatch } from 'react-redux'
import { createNote } from '../reducers/noteReducer'

const NewNote = () => {

  const dispatch = useDispatch()

  const addNote = async (event) => {
    event.preventDefault()
    
    const content = event.target.note.value
    event.target.note.value = ''

    // const newNote = await noteService.createNew(content)
    // dispatch(createNote(newNote))
    dispatch(createNote(content)) // the above was abstracted.

  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

export default NewNote
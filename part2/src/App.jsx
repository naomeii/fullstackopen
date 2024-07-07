import { useState } from 'react'
import Note from './components/Note'


const App = (props) => {
  const [notes, setNotes] = useState(props.notes)

  const [newNote, setNewNote] = useState(
    'a new note...'
  )
  
  const [showAll, setShowAll] = useState(true) // show all or only important notes?

  // const result = condition ? val1 : val2
  const notesToShow = showAll
  ? notes
  : notes.filter(note => note.important === true) // when function is called, shows either all or only important notes based on showAll state

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5, // our note has 50% chance of importance
      id: notes.length + 1,
    }
  
    setNotes(notes.concat(noteObject))
    setNewNote('')
  }

  const handleNoteChange = (event) => { // no preventDefault because no default action occurs on an input change
    console.log(event.target.value)
    setNewNote(event.target.value)
  }


  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>

        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">save</button>
      </form>   
    </div>
  )
}

export default App 
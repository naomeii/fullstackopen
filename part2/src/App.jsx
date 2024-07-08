import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])

  const [newNote, setNewNote] = useState('')
  
  const [showAll, setShowAll] = useState(true) // show all or only important notes?

//   const hook = () => {
//     // console.log('effect')
//     axios
//       .get('http://localhost:3001/notes')
//       .then(response => {
//         // console.log('promise fulfilled')
//         setNotes(response.data)
//       })
//   }
  
//   useEffect(hook, []) // takes in hook func, then the effect itself
//   // By default, effects run after every completed render, but you can choose to fire it only when certain values have changed.
//  // The second parameter of useEffect is used to specify how often the effect is run. 
//  // If the second parameter is an empty array [], then the effect is only run along with the first render of the component.
  useEffect(() => {
    noteService
    .getAll()
    .then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])

  // const result = condition ? val1 : val2
  const notesToShow = showAll
  ? notes
  : notes.filter(note => note.important === true) // when function is called, shows either all or only important notes based on showAll state

  const toggleImportanceOf = id => {
    // const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
  
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        alert(
          `the note '${note.content}' was already deleted from server`
        )
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  // const addNote = (event) => {
  //   event.preventDefault()
  //   const noteObject = {
  //     content: newNote,
  //     important: Math.random() < 0.5, // our note has 50% chance of importance
  //     id: notes.length + 1,
  //   }
  
  //   setNotes(notes.concat(noteObject))
  //   setNewNote('')
  // }

  const addNote = event => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }
    
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  const handleNoteChange = (event) => { // no preventDefault because no default action occurs on an input change
    // console.log(event.target.value)
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
          <Note 
          key={note.id} 
          note={note}
          toggleImportance={() => toggleImportanceOf(note.id)}
          />
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
import { useState, useEffect, useRef } from 'react'
// import axios from 'axios'

// components
import Note from './components/Note'
import Footer from './components/Footer'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import NoteForm from './components/NoteForm'


import noteService from './services/notes'
import loginService from './services/login'


const App = () => {
  const [notes, setNotes] = useState(null)
  const [showAll, setShowAll] = useState(true) // show all or only important notes?
  const [errorMessage, setErrorMessage] = useState(null)
  // part 5
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  // part5b
  const [loginVisible, setLoginVisible] = useState(false)

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
  }, []) // only executed after the first render


  // if yes, save details to the state of the application and noteService
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, []) // [] ensures this only gets executed when page is rendered for the first time

  // const result = condition ? val1 : val2
  const notesToShow = showAll
  ? notes
  : notes.filter(note => note.important === true) // when function is called, shows either all or only important notes based on showAll state

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
  
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(() => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const addNote = (noteObject) => {
    // hide new note form after creating a new note
    noteFormRef.current.toggleVisibility()
    
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      // saves the logged in user to local storage. Obj is parsed to JSON with JSON.stringify
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      ) 

      noteService.setToken(user.token)

      // console.log(user)

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }


  
  const loginForm = () => {
    // inline style rule, where the value of the display property is none if we do not want the component to be displayed:
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const noteFormRef = useRef()

  const noteForm = () => (
    <Togglable buttonLabel='new note' ref={noteFormRef}>
      <NoteForm createNote={addNote} />
    </Togglable>
  )


  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {user === null ?
      loginForm() : noteForm()
      }

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        {
          notesToShow !== null && 
          notesToShow.map(note =>
            <Note 
            key={note.id} 
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
            />)
        }
      </ul>
      <Footer />   
    </div>
  )
}

export default App 
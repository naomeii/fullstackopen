// const App = () => {
//   return null
// }

// export default App

// Bundling a React application
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useNotes = (url) => {
  const [notes, setNotes] = useState([])
  useEffect(() => {
    axios.get(url).then(response => {
      setNotes(response.data)
    })
  }, [url])
  return notes
}

const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState([])
  const notes = useNotes(BACKEND_URL)

//   const url = 'https://notes2023.fly.dev/api/notes'
//   const notes = useNotes(url)

  const handleClick = () => {
    setCounter(counter + 1)
    setValues(values.concat(counter))
  }

  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={handleClick}>press</button>
      <div>{notes.length} notes on server {BACKEND_URL}</div>
    </div>
  )
}

export default App
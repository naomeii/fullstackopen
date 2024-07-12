require('dotenv').config()

const express = require('express');  
const app = express();
// cross origin policy
const cors = require('cors')
// mongoose stuff
const Note = require('./models/note')

// // part 3 Connecting the backend to a database
// const password = process.argv[2]

// // DO NOT SAVE YOUR PASSWORD TO GITHUB!!
// const url = process.env.MONGODB_URL;

// mongoose.set('strictQuery',false)
// mongoose.connect(url)

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// })

// noteSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//   }
// })

// const Note = mongoose.model('Note', noteSchema)

app.use(cors()) // allows requests from other origins
// Express json-parser that takes JSON data of a request and transfom it into JS obj
app.use(express.json())
app.use(express.static('dist')) // makes Express show static content: index.html, Js, etc

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})


app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
  })

// app.get('/', (request, response) => {
//     response.send('<h1>Hello World!</h1>')
//   })
  
// app.get('/api/notes', (request, response) => {
//     response.json(notes)
// })
app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})
  
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
require('dotenv').config()

const express = require('express');  
const app = express();
// cross origin policy
const cors = require('cors')
// mongoose stuff
const Note = require('./models/note')


app.use(cors()) // allows requests from other origins
// Express json-parser that takes JSON data of a request and transfom it into JS obj
app.use(express.json())
app.use(express.static('dist')) // makes Express show static content: index.html, Js, etc

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

app.post('/api/notes', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })

    .catch(error => next(error))
})

// toggling importance of a note / editting it
app.put('/api/notes/:id', (request, response, next) => {

  const { content, important } = request.body

  Note.findByIdAndUpdate(request.params.id, { content, important },{ new: true, runValidators: true, context: 'query' }) 
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

// fetching an individual note from MongoDB
app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })

    .catch(error => next(error)) // moving error handling to our own error handler middleware
})

// deleting a note
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

// our very own error handler middleware
// 1. if next was called w/o argument, the execution will simply move onto the next route or middleware
// 2. else the execution will continue to the error middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })

  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)
  
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
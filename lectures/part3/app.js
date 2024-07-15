const config = require('./utils/config')
const express = require('express')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')


// you introduce the library to elimate try/catch from our controllers/notes.js methods before you import your routes
require('express-async-errors') // automatically catches error and passed to the error-handling middleware for us


const app = express()
const cors = require('cors') // allows requests from other origins
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json()) // Express json-parser that takes JSON data of a request and transfom it into JS obj
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter) //
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(middleware.errorHandler)

module.exports = app
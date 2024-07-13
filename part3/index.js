const http = require('http');
const express = require('express');  
const app = express();
const morgan = require('morgan')
// cross origin policy
const cors = require('cors')
// mongoose stuff
const Person = require('./models/person')
app.use(cors()) // allows requests from other origins

// 3.7, logs requests before they are processed further: captures all incoming requests 
app.use(morgan('tiny'))
app.use(express.static('dist'))

// 3.5 
// Express json-parser that takes JSON data of a request and transfom it into JS obj
app.use(express.json())
// this json-parser is Middleware: 
// functions that can be used for handling request and response objects.
// middlewares are executed one by one in the orer they were listed in the application code

// custom morgan token to log POST request body
morgan.token('post-data', (req, res) => JSON.stringify(req.body))

// use morgan middleware with custom token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));

// get all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// get phonebook info
app.get('/info', (request, response) => {
  Person.countDocuments({})
    .then(count => {
      const date = new Date().toString();
      const display = `Phonebook has info for ${count} people`;
      response.send(`<p>${display}</p><p>${date}</p>`);
    })
    .catch(error => {
      console.log('Error displaying info:', error);
      response.status(500).send('Error displaying info');
    });
});

// fetching an individual person from MongoDB
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })

    .catch(error => next(error)) // moving error handling to our own error handler middleware
})

// deleting a person from MongoDB
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    })
  }
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => {
    if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message });
    }
    next(error); // Forward other errors to the global error handler
  });
})


// will be called if person already exists in phonebook
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true }) // new: true triggers our event handler to use our modified document instead of the OG
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => {
      if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
      }
      next(error); // Forward other errors to the global error handler
    });
})

// Middleware functions have to be used before routes bc we want them to be executed by the route event handlers
// sometimes we use them after routes when middleware functions are only caled if no route handler processes the HTTP request
// This middleware will be used for catching requests made to non-existent routes. For these requests, the middleware will return an error message in the JSON format.
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

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
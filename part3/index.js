const http = require('http');
const express = require('express');  
const app = express();
const morgan = require('morgan')

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

// 3.7, logs requests before they are processed further: captures all incoming requests 
app.use(morgan('tiny'))

app.use(express.static('dist'))

// 3.5 
// Express json-parser that takes JSON data of a request and transfom it into JS obj
app.use(express.json())
// this json-parser is Middleware: 
// functions that can be used for handling request and response objects.
// middlewares are executed one by one in the orer they were listed in the application code

// implementing our own Middleware: a function that receives 3 parameters
// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }
// app.use(requestLogger)

// custom morgan token to log POST request body
morgan.token('post-data', (req, res) => JSON.stringify(req.body))

// use morgan middleware with custom token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));

// 3.1
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// 3.2
app.get('/info', (request, response) => {
    const date = new Date().toString();
    const display = `Phonebook has info for ${persons.length} people`;

    response.send(`<p>${display}</p><p>${date}</p>`);
    
  })

// 3.3
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

// 3.4
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})


const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(person => Number(person.id)))
    : 0
  return String(maxId + 1)
}

app.post('/api/persons', (request, response) => {
  const body = request.body // this will be undefined w out our json parser

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    })
  }
  if (persons.find(person => person.name === body.name)){
    return response.status(400).json({ 
        error: 'name must be unique' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(persons)
})


// Middleware functions have to be used before routes bc we want them to be executed by the route event handlers
// sometimes we use them after routes when middleware functions are only caled if no route handler processes the HTTP request

// This middleware will be used for catching requests made to non-existent routes. For these requests, the middleware will return an error message in the JSON format.
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


  
  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
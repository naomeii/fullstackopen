const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')

// ensure the database is in the same state before every test is run
beforeEach(async () => {
  await Note.deleteMany({}) // database is cleared out

  // then we save the notes stored in initialNotes into the database
  let noteObject = new Note(helper.initialNotes[0])
  await noteObject.save()

  noteObject = new Note(helper.initialNotes[1])
  await noteObject.save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')
  assert.strictEqual(response.body.length, helper.initialNotes.length)
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')

  const contents = response.body.map(r => r.content)

  assert(contents.includes('Browser can execute only JavaScript'))
})

test('a valid note can be added ', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true,
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)


  const notesAtEnd = await helper.notesInDb()
  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)


  const contents = notesAtEnd.map(n => n.content)
  assert(contents.includes('async/await simplifies making async calls'))
})

test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)


  const notesAtEnd = await helper.notesInDb()

  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
})

test('a specific note can be viewed', async () => {
  const notesAtStart = await helper.notesInDb()

  const noteToView = notesAtStart[0]

  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultNote.body, noteToView)
})

test('a note can be deleted', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToDelete = notesAtStart[0]

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)

  const notesAtEnd = await helper.notesInDb()

  const contents = notesAtEnd.map(r => r.content)
  assert(!contents.includes(noteToDelete.content))

  assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
})

// index.js was changed to:
// const app = require('./app') // the actual Express app
// const config = require('./utils/config')
// const logger = require('./utils/logger')

// app.listen(config.PORT, () => {
//   logger.info(`Server running on port ${config.PORT}`)
// })

// ----------------------------------------------------
// but the tests only use the Express application defined in the app.js file,
// which does not listen to any ports.

// const mongoose = require('mongoose')
// const supertest = require('supertest')
// const app = require('../app')
// const api = supertest(app)

// because:
// if the server is not already listening for connections then
// it is bound to an ephemeral port for you so
// there is no need to keep track of ports.
// i.e supertest takes care that the application is being tested is started at the port that it uses internally
// after all tests have finished running
after(async () => {
  await mongoose.connection.close()
})


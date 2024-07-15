const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

// returns all users in the database
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('notes', { content: 1, important: 1 }) // joins all of their notes aka displays all their note contents
  // takes the ids referencing 'notes' objects and replace them by the referenced 'notes' documents.
  // selects to display only content and imporant fields
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter
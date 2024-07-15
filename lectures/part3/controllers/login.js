const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  // if info valid, token is created. contains username and user id in digitally signed form
  // token expires in 60*60 seconds, that is, in one hour
  // tokens need to expire bc once the API user/React app gets a token, the API has a blind trust to the token holder.
  // access rights of the token holder may need to be revoked
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 60*60 } // forces the user to relogin after expiration, pass TokenExpiredError to our middleware
  )


  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
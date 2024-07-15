const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')

const bcrypt = require('bcrypt')
const User = require('../models/user')

//...

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  describe('4.16', () => {
    test('adding valid user', async() => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
        username: 'noob',
        name: 'Lina',
        password: 'lol123',
        }

        const result  = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })
  
    test('reject user without username', async() => {
        const usersAtStart = await helper.usersInDb()

        const noUsername = {
        name: 'sam',
        password: 'limit'
        }

        await api
        .post('/api/users')
        .send(noUsername)
        .expect(400)

        
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)

    })
    
    test('reject no password', async() => {
        const usersAtStart = await helper.usersInDb()

        const noPassword = {
            name: 'sam',
            username: 'limit'
        }

        await api
        .post('/api/users')
        .send(noPassword)
        .expect(400)

        
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)

    })

    test('reject username < 3', async() => {
        const usersAtStart = await helper.usersInDb()

        const badUsername = {
          username: 's',
          name: 'ihavealongname',
          password: 'limit'
        }

        await api
        .post('/api/users')
        .send(badUsername)
        .expect(400)

        
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)

    })

    test('reject password < 3', async() => {
        const usersAtStart = await helper.usersInDb()

        const badPassword = {
          username: 'sammy',
          name: 'ihavealongname',
          password: 'a'
        }

        await api
        .post('/api/users')
        .send(badPassword)
        .expect(400)

        
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)

    })

  })
})

after(async () => {
    await mongoose.connection.close()
  })
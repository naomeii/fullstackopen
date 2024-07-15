const { test, beforeEach, describe, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')

const blogHelper = require('../utils/blog_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

// ensure the database is in the same state before every test is run
beforeEach(async () => {
    await Blog.deleteMany({}) // database is cleared out
  
    // then we save the notes stored in initialNotes into the database
    const blogObjects = blogHelper.initialBlogs
      .map(blog => new Blog(blog))
  
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)// makes sure beforeEach waits on .map to finish
    // Promise.all takes an iterable of promises and returns a single Promise
    // it also executes the promises it receives in parallel
    // if needed to execute in a specific order, use for..of block like:
  
    //   beforeEach(async () => {
    //     await Note.deleteMany({})
  
    //     for (let note of helper.initialNotes) {
    //       let noteObject = new Note(note)
    //       await noteObject.save()
    //     }
    //   })  
    
})

describe('4.8-4.12 tests', () => {


    test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, blogHelper.initialBlogs.length)
    })

    test('id not _id', async () => {
        const response = await api.get('/api/blogs')
        assert.ok(response.body[0].id);
    })


    test('a valid blog can be added ', async () => {
        const newBlog = {
        "title": "adding valid blog",
        "author": "quest",
        "url": "hi.com",
        "likes": 0,
        }
    
        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    
        const blogsAfterAdd = await blogHelper.blogsInDb()
        assert.strictEqual(blogsAfterAdd.length, blogHelper.initialBlogs.length + 1)
    
    
        const blogs = blogsAfterAdd.map(b => b.title)
        assert(blogs.includes('adding valid blog'))
    })


    test('blogs w/o likes default to 0', async () => {
        const newBlog = {
            "title": "no one likes me :(",
            "author": "qqq",
            "url": "lol.com"
        }
    
        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    
        const blogsAfterAdd = await blogHelper.blogsInDb()
        const addedBlog = blogsAfterAdd.find(blog => 
            blog.title === newBlog.title &&
            blog.author === newBlog.author &&
            blog.url === newBlog.url
        );

        // console.log(blogsAfterAdd)
        assert(addedBlog.likes === 0)

    })

    test('creating blogs w/o title OR url returns 400 Bad Request', async () => {
        const noTitle = {
            "author": "hi",
            "url": "lol.com"
        }
    
        await api
        .post('/api/blogs')
        .send(noTitle)
        .expect(400)  
        
        const noURL = {
            "title": "no url asf",
            "author": "123",
        }

        await api
        .post('/api/blogs')
        .send(noURL)
        .expect(400) 

        const noTitleORUrl = {
            "author": "no"
        }

        await api
        .post('/api/blogs')
        .send(noTitleORUrl)
        .expect(400) 
    })
})

describe('4.13-4.14 tests', () => {

    // test('deleting a blog', async () => {

    //     const blogsAtStart = await blogHelper.blogsInDb()
    //     const blogToDelete = blogsAtStart[0]

    //     await api
    //     .delete(`/api/blogs/${blogToDelete.id}`)
    //     .expect(204)

    //     const blogsAfterDelete = await blogHelper.blogsInDb()

    //     assert.strictEqual(blogsAfterDelete.length, blogHelper.initialBlogs.length - 1)

    //     // console.log(blogsAfterDelete)
    //     assert(!blogsAfterDelete.includes(blogToDelete))

    // })

    test('testing likes were updated', async () => {

        const blogsAtStart = await blogHelper.blogsInDb();
        const initialLikes = blogsAtStart[0].likes;
      
        const updatedBlog = {
          ...blogsAtStart[0],
          likes: initialLikes + 3
        };
      
        await api
          .put(`/api/blogs/${blogsAtStart[0].id}`)
          .send(updatedBlog)

        // console.log(blogsAtStart[0], updatedBlog)
      
        const blogsAfterUpdate = await blogHelper.blogsInDb();
        const foundBlog = blogsAfterUpdate.find(blog => blog.id === updatedBlog.id);
        
        // console.log(foundBlog, updatedBlog)

        assert.strictEqual(foundBlog.likes, initialLikes + 3);

    })


})


// / index.js was changed to:
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



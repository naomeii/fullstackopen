const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!body.title || !body.url) {
    response.status(400).end()
  }

  const blog = new Blog({
    "title": body.title,
    "author": body.author,
    "url": body.url,
    "likes": body.likes || 0,
    "user": user._id

  })
  
  const savedBlog = await blog.save()
  // save to users aswell
  user.blogs = user.blogs.concat(savedBlog._id) // add note to notes array in user
  await user.save()

  response.status(201).json(savedBlog)

})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {

  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if ( blog.user.toString() === user.id.toString()){
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }

  // return response.status(401).json({ error: 'token invalid' })

})

// updating likes of a post
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    "title": body.title,
    "author": body.author,
    "url": body.url,
    "likes": body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})


module.exports = blogsRouter
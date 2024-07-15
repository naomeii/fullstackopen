const Blog = require('../models/blog')

const initialBlogs = [
    {
      "title": "Hi",
      "author": "wishthaworst",
      "url": "google.com",
      "likes": 2,
      "id": "6692c9a01f3872a5d6e67897"
    },
    {
      "title": "another post",
      "author": "sweetheart",
      "url": "reddit.com",
      "likes": 0,
      "id": "6692c9eb1f3872a5d6e6789a"
    },
    {
      "title": "complted 4.2!",
      "author": "honeypilled",
      "url": "facebook.com",
      "likes": 1,
      "id": "6692d08f0a34116087451428"
    }
  ]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, blogsInDb
}
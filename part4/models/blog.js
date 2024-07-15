const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString() // converst _id to id
      delete returnedObject._id
      delete returnedObject.__v // version key is used by Mongoose not rly needed for us
    }
})

module.exports = mongoose.model('Blog', blogSchema)
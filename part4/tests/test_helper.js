
const User = require('../models/user');


// const initialUsers = [
//   {
//     "username": "root",
//     "name": "Superuser",
//     "id": "669482add0b00c22c4e98c18"
//   },
//   {
//     "username": "mluukkai",
//     "name": "Matti Luukkainen",
//     "id": "669482c4d0b00c22c4e98c1a"
//   }
// ]


const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }
  
  module.exports = {
    usersInDb
  }
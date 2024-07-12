const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

// establishes connection to the database
const url =
    `mongodb+srv://naomiari:${password}@cluster0.yvuv8tb.mongodb.net/noteApp?retryWrites=true&w=majority`
mongoose.set('strictQuery',false)

mongoose.connect(url)

// each schema maps to a MongoDB collection & defines the shape of the documents within that collection
const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema) // 'Note' is the singular name of the model
// The name of the collection will be the lowercase plural notes, 
// because the Mongoose convention is to automatically name collections as the plural (e.g. notes) when the schema refers to them in the singular (e.g. Note).

// const note = new Note({
//   content: 'Mongoose makes things easy',
//   important: true,
// })

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })

// fetching objects from the database
// Note.find({}): we get all of the notes stored in the notes collection
Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })

// we could restrict our search to only include important notes by:
// Note.find({ important: true }).then(result => {
//     // ...
//   })
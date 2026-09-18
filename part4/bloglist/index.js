require('dotenv').config()

const app = require('./app')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 3003

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch(error => {
    console.log('Error connecting to MongoDB:', error.message)
  })
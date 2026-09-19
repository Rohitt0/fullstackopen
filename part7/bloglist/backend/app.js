require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const testingRouter = require('./controllers/testing')

const {
  tokenExtractor,
  unknownEndpoint,
  errorHandler
} = require('./utils/middleware')

const app = express()

mongoose.set('strictQuery', false)

app.use(express.json())
app.use(tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/testing', testingRouter)

const frontendPath = path.join(__dirname, '../frontend/dist')
app.use(express.static(frontendPath))

app.get('/{*splat}', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next()
  }

  res.sendFile(path.join(frontendPath, 'index.html'))
})

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app

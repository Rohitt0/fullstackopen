require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const {
  unknownEndpoint,
  errorHandler
} = require('./utils/middleware')

const app = express()

mongoose.set('strictQuery', false)

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
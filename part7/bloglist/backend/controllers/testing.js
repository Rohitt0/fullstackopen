const testingRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')

testingRouter.post('/reset', async (request, response, next) => {
  if (process.env.NODE_ENV !== 'test') {
    return response.status(404).end()
  }

  try {
    await Blog.deleteMany({})
    await User.deleteMany({})

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

module.exports = testingRouter
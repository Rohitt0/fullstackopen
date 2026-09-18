const { test, before, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({ path: '.env.test', override: true })

const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://example.com/dijkstra',
    likes: 5
  },
  {
    title: 'Canonicalization',
    author: 'Robert C. Martin',
    url: 'http://example.com/martin',
    likes: 12
  }
]

before(async () => {
  await mongoose.connect(process.env.MONGODB_URI)
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('the unique identifier property is named id', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)

  assert(response.body.every(blog => blog.id))
})

after(async () => {
  await mongoose.connection.close()
})
const { test, before, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({ path: '.env.test', override: true })

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

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

const createUserAndLogin = async (
  username = 'testuser'
) => {
  const password = 'password123'

  await api
    .post('/api/users')
    .send({
      username,
      password,
      name: 'Test User'
    })
    .expect(201)

  const loginResponse = await api
    .post('/api/login')
    .send({
      username,
      password
    })
    .expect(200)

  return loginResponse.body.token
}

before(async () => {
  await mongoose.connect(process.env.MONGODB_URI)
})

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
})

test('blogs are returned as json', async () => {
  await Blog.insertMany(initialBlogs)

  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(
    response.body.length,
    initialBlogs.length
  )
})

test('the unique identifier property is named id', async () => {
  await Blog.insertMany(initialBlogs)

  const response = await api
    .get('/api/blogs')
    .expect(200)

  assert(
    response.body.every(blog => blog.id)
  )
})

test('a blog can be created', async () => {
  const token = await createUserAndLogin()

  const before = await Blog.countDocuments()

  const newBlog = {
    title: 'New Blog',
    author: 'Test Author',
    url: 'http://example.com/new-blog',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  const after = await Blog.countDocuments()

  assert.strictEqual(after, before + 1)

  const savedBlog = await Blog.findOne({
    title: newBlog.title
  })

  assert.strictEqual(savedBlog.author, newBlog.author)
  assert.strictEqual(savedBlog.url, newBlog.url)
  assert.strictEqual(savedBlog.likes, newBlog.likes)
})

test('likes defaults to 0 when missing', async () => {
  const token = await createUserAndLogin()

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Blog Without Likes',
      author: 'Test Author',
      url: 'http://example.com/no-likes'
    })
    .expect(201)

  assert.strictEqual(response.body.likes, 0)

  const savedBlog = await Blog.findOne({
    title: 'Blog Without Likes'
  })

  assert.strictEqual(savedBlog.likes, 0)
})

test('creating a blog without title returns 400', async () => {
  const token = await createUserAndLogin()

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      author: 'Test Author',
      url: 'http://example.com/no-title',
      likes: 5
    })
    .expect(400)

  assert.strictEqual(
    await Blog.countDocuments(),
    0
  )
})

test('creating a blog without url returns 400', async () => {
  const token = await createUserAndLogin()

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'No URL',
      author: 'Test Author',
      likes: 5
    })
    .expect(400)

  assert.strictEqual(
    await Blog.countDocuments(),
    0
  )
})

test('a blog can be deleted', async () => {
  const token = await createUserAndLogin()

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Delete Me',
      author: 'Test Author',
      url: 'http://example.com/delete-me',
      likes: 5
    })
    .expect(201)

  await api
    .delete(`/api/blogs/${response.body.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  assert.strictEqual(
    await Blog.countDocuments(),
    0
  )
})

test('a blog can be updated', async () => {
  const token = await createUserAndLogin()

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Update Me',
      author: 'Test Author',
      url: 'http://example.com/update-me',
      likes: 5
    })
    .expect(201)

  const updated = await api
    .put(`/api/blogs/${response.body.id}`)
    .send({
      title: 'Updated Blog',
      author: 'Updated Author',
      url: 'http://example.com/updated',
      likes: 25
    })
    .expect(200)

  assert.strictEqual(
    updated.body.title,
    'Updated Blog'
  )

  assert.strictEqual(
    updated.body.likes,
    25
  )
})

test('a user can be created', async () => {
  await api
    .post('/api/users')
    .send({
      username: 'rohit',
      password: 'password123',
      name: 'Rohit'
    })
    .expect(201)

  const response = await api
    .get('/api/users')
    .expect(200)

  assert.strictEqual(response.body.length, 1)
  assert.strictEqual(response.body[0].username, 'rohit')
  assert.strictEqual(response.body[0].name, 'Rohit')
  assert.strictEqual(
    response.body[0].passwordHash,
    undefined
  )
})

test('invalid users are not created', async () => {
  await api
    .post('/api/users')
    .send({
      username: 'ab',
      password: 'password123'
    })
    .expect(400)

  await api
    .post('/api/users')
    .send({
      username: 'validuser',
      password: 'ab'
    })
    .expect(400)

  await api
    .post('/api/users')
    .send({
      password: 'password123'
    })
    .expect(400)

  await api
    .post('/api/users')
    .send({
      username: 'validuser'
    })
    .expect(400)

  assert.strictEqual(
    await User.countDocuments(),
    0
  )
})

test('username must be unique', async () => {
  await api
    .post('/api/users')
    .send({
      username: 'uniqueuser',
      password: 'password123'
    })
    .expect(201)

  await api
    .post('/api/users')
    .send({
      username: 'uniqueuser',
      password: 'anotherpassword'
    })
    .expect(400)

  assert.strictEqual(
    await User.countDocuments(),
    1
  )
})

test('blogs contain creator information', async () => {
  const token = await createUserAndLogin(
    'creatoruser'
  )

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Creator Blog',
      author: 'Test Author',
      url: 'http://example.com/creator-blog',
      likes: 5
    })
    .expect(201)

  const blogsResponse = await api
    .get('/api/blogs')
    .expect(200)

  assert.strictEqual(
    blogsResponse.body[0].user.username,
    'creatoruser'
  )

  const usersResponse = await api
    .get('/api/users')
    .expect(200)

  assert.strictEqual(
    usersResponse.body[0].blogs.length,
    1
  )

  assert.strictEqual(
    usersResponse.body[0].blogs[0].title,
    'Creator Blog'
  )
})

test('login returns a token with correct credentials', async () => {
  await api
    .post('/api/users')
    .send({
      username: 'loginuser',
      password: 'password123',
      name: 'Login User'
    })
    .expect(201)

  const response = await api
    .post('/api/login')
    .send({
      username: 'loginuser',
      password: 'password123'
    })
    .expect(200)

  assert(response.body.token)
  assert.strictEqual(
    response.body.username,
    'loginuser'
  )
})

test('login fails with wrong credentials', async () => {
  await api
    .post('/api/users')
    .send({
      username: 'loginuser',
      password: 'password123'
    })
    .expect(201)

  await api
    .post('/api/login')
    .send({
      username: 'loginuser',
      password: 'wrongpassword'
    })
    .expect(401)
})

test('creating a blog requires a valid token', async () => {
  await api
    .post('/api/blogs')
    .send({
      title: 'No Token',
      author: 'Test Author',
      url: 'http://example.com/no-token',
      likes: 5
    })
    .expect(401)

  assert.strictEqual(
    await Blog.countDocuments(),
    0
  )
})

test('a valid token identifies the creator', async () => {
  const token = await createUserAndLogin(
    'tokenuser'
  )

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Token Blog',
      author: 'Test Author',
      url: 'http://example.com/token-blog',
      likes: 5
    })
    .expect(201)

  assert.strictEqual(
    response.body.user.username,
    'tokenuser'
  )
})

test('only the creator can delete a blog', async () => {
  const creatorToken = await createUserAndLogin(
    'creator'
  )

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${creatorToken}`)
    .send({
      title: 'Protected Blog',
      author: 'Test Author',
      url: 'http://example.com/protected',
      likes: 5
    })
    .expect(201)

  const otherToken = await createUserAndLogin(
    'otheruser'
  )

  await api
    .delete(`/api/blogs/${response.body.id}`)
    .set('Authorization', `Bearer ${otherToken}`)
    .expect(401)

  assert.strictEqual(
    await Blog.countDocuments(),
    1
  )

  await api
    .delete(`/api/blogs/${response.body.id}`)
    .set('Authorization', `Bearer ${creatorToken}`)
    .expect(204)

  assert.strictEqual(
    await Blog.countDocuments(),
    0
  )
})

test('deleting a blog without a token returns 401', async () => {
  const creatorToken = await createUserAndLogin(
    'creator'
  )

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${creatorToken}`)
    .send({
      title: 'Protected Blog',
      author: 'Test Author',
      url: 'http://example.com/protected',
      likes: 5
    })
    .expect(201)

  await api
    .delete(`/api/blogs/${response.body.id}`)
    .expect(401)
})

after(async () => {
  await mongoose.connection.close()
})
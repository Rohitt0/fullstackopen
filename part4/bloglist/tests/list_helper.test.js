const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

const blogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    likes: 5
  },
  {
    title: 'Canonicalization',
    author: 'Robert C. Martin',
    likes: 12
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    likes: 8
  },
  {
    title: 'The Mythical Man-Month',
    author: 'Fred Brooks',
    likes: 7
  }
]

describe('dummy', () => {
  test('returns one', () => {
    assert.strictEqual(
      listHelper.dummy([]),
      1
    )
  })
})

describe('total likes', () => {
  test('of an empty list is zero', () => {
    assert.strictEqual(
      listHelper.totalLikes([]),
      0
    )
  })

  test('of a list is calculated correctly', () => {
    assert.strictEqual(
      listHelper.totalLikes(blogs),
      32
    )
  })
})

describe('favorite blog', () => {
  test('is the blog with the most likes', () => {
    assert.deepStrictEqual(
      listHelper.favoriteBlog(blogs),
      blogs[1]
    )
  })
})

describe('most blogs', () => {
  test('is the author with the most blogs', () => {
    assert.deepStrictEqual(
      listHelper.mostBlogs(blogs),
      {
        author: 'Robert C. Martin',
        blogs: 2
      }
    )
  })
})

describe('most likes', () => {
  test('is the author with the most likes', () => {
    assert.deepStrictEqual(
      listHelper.mostLikes(blogs),
      {
        author: 'Robert C. Martin',
        likes: 20
      }
    )
  })
})
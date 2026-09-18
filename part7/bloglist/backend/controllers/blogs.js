const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', {
      username: 1,
      name: 1
    })
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id).populate('user', {
      username: 1,
      name: 1
    })

    if (!blog) {
      return response.status(404).end()
    }

    response.json(blog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  try {
    const body = request.body

    if (!body.title || !body.url) {
      return response.status(400).json({
        error: 'title and url are required'
      })
    }

    const user = request.user

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes ?? 0,
      comments: [],
      user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    const populatedBlog = await savedBlog.populate('user', {
      username: 1,
      name: 1
    })

    response.status(201).json(populatedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).end()
    }

    if (
      !blog.user ||
      blog.user.toString() !== request.user._id.toString()
    ) {
      return response.status(401).json({
        error: 'only the creator can delete the blog'
      })
    }

    await Blog.findByIdAndDelete(request.params.id)

    await User.findByIdAndUpdate(request.user._id, {
      $pull: {
        blogs: blog._id
      }
    })

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const body = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        comments: body.comments
      },
      {
        new: true,
        runValidators: true
      }
    ).populate('user', {
      username: 1,
      name: 1
    })

    if (!updatedBlog) {
      return response.status(404).end()
    }

    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/:id/comments', async (request, response, next) => {
  try {
    const { content } = request.body

    if (!content || !content.trim()) {
      return response.status(400).json({
        error: 'comment content is required'
      })
    }

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).end()
    }

    blog.comments = blog.comments.concat({
      content: content.trim()
    })

    const savedBlog = await blog.save()

    await savedBlog.populate('user', {
      username: 1,
      name: 1
    })

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter

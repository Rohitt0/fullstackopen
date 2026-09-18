import { useEffect, useState } from 'react'
import {
  Navigate,
  Route,
  Routes,
  useNavigate
} from 'react-router-dom'
import { Container } from '@mui/material'

import Navigation from './components/Navigation'
import Notification from './components/Notification'
import BlogListPage from './components/BlogListPage'
import LoginPage from './components/LoginPage'
import CreateBlogPage from './components/CreateBlogPage'
import SingleBlogPage from './components/SingleBlogPage'

import blogService from './services/blogs'
import loginService from './services/login'

const STORAGE_KEY = 'loggedBlogappUser'

const getStoredUser = () => {
  const userJSON = window.localStorage.getItem(STORAGE_KEY)

  if (!userJSON) {
    return null
  }

  try {
    return JSON.parse(userJSON)
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

const App = () => {
  const navigate = useNavigate()

  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(getStoredUser)
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type) => {
    setNotification({
      message,
      type
    })
  }

  useEffect(() => {
    if (user) {
      blogService.setToken(user.token)
    } else {
      blogService.setToken(null)
    }
  }, [user])

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsFromServer = await blogService.getAll()
        setBlogs(blogsFromServer)
      } catch (error) {
        setNotification({
          message:
            error.response?.data?.error || 'loading blogs failed',
          type: 'error'
        })
      }
    }

    fetchBlogs()
  }, [])

  const handleLogin = async credentials => {
    try {
      const loggedUser = await loginService.login(credentials)

      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(loggedUser)
      )

      blogService.setToken(loggedUser.token)
      setUser(loggedUser)

      showNotification('login successful', 'success')
      navigate('/')
    } catch (error) {
      showNotification(
        error.response?.data?.error || 'invalid username or password',
        'error'
      )
      throw error
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem(STORAGE_KEY)
    blogService.setToken(null)
    setUser(null)
    navigate('/')
    showNotification('logged out', 'success')
  }

  const handleCreate = async blog => {
    try {
      const createdBlog = await blogService.create(blog)

      setBlogs(currentBlogs =>
        [...currentBlogs, createdBlog].sort(
          (a, b) => b.likes - a.likes
        )
      )

      showNotification(
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        'success'
      )

      navigate('/')
    } catch (error) {
      showNotification(
        error.response?.data?.error || 'creating blog failed',
        'error'
      )
      throw error
    }
  }

  const handleLike = async blog => {
    try {
      const updatedBlog = {
        ...blog,
        user: blog.user?.id || blog.user?._id,
        likes: blog.likes + 1
      }

      const response = await blogService.update(
        blog.id,
        updatedBlog
      )

      setBlogs(currentBlogs =>
        [...currentBlogs.map(currentBlog =>
          currentBlog.id === response.id
            ? response
            : currentBlog
        )].sort((a, b) => b.likes - a.likes)
      )

      showNotification('blog liked', 'success')

      return response
    } catch (error) {
      showNotification(
        error.response?.data?.error || 'liking blog failed',
        'error'
      )
      throw error
    }
  }

  const handleRemove = async blog => {
    try {
      await blogService.remove(blog.id)

      setBlogs(currentBlogs =>
        currentBlogs.filter(currentBlog =>
          currentBlog.id !== blog.id
        )
      )

      showNotification(
        `blog ${blog.title} removed`,
        'success'
      )

      navigate('/')
    } catch (error) {
      showNotification(
        error.response?.data?.error || 'removing blog failed',
        'error'
      )
      throw error
    }
  }

  const closeNotification = () => {
    setNotification(null)
  }

  return (
    <Container maxWidth="md" sx={{ pb: 5 }}>
      <Navigation
        user={user}
        onLogout={handleLogout}
      />

      <Notification
        notification={notification}
        onClose={closeNotification}
      />

      <Routes>
        <Route
          path="/"
          element={
            <BlogListPage
              blogs={blogs}
              user={user}
              onLike={handleLike}
              onRemove={handleRemove}
            />
          }
        />

        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/" replace />
              : <LoginPage onLogin={handleLogin} />
          }
        />

        <Route
          path="/create"
          element={
            user
              ? <CreateBlogPage onCreate={handleCreate} />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/blogs/:id"
          element={
            <SingleBlogPage
              blogs={blogs}
              user={user}
              onLike={handleLike}
              onRemove={handleRemove}
            />
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </Container>
  )
}

export default App
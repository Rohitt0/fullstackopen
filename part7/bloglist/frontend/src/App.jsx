import { useEffect, useState } from 'react'
import {
  Navigate,
  Route,
  Routes
} from 'react-router-dom'
import {
  Container,
  Typography
} from '@mui/material'

import Navigation from './components/Navigation'
import Notification from './components/Notification'
import ErrorBoundary from './components/ErrorBoundary'
import BlogListPage from './components/BlogListPage'
import LoginPage from './components/LoginPage'
import CreateBlogPage from './components/CreateBlogPage'
import Users from './components/Users'
import User from './components/User'
import BlogView from './components/BlogView'
import NotFound from './components/NotFound'

import {
  useActions,
  useUser
} from './store'

const App = () => {
  const user = useUser()
  const { initialize, login } = useActions()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initialize().finally(() => {
      setLoading(false)
    })
  }, [initialize])

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography>
          loading...
        </Typography>
      </Container>
    )
  }

  const handleLogin = async credentials => {
    await login(credentials)
  }

  return (
    <Container maxWidth="md" sx={{ pb: 5 }}>
      <Navigation />

      <Notification />

      <ErrorBoundary>
        <Routes>
          <Route
            path="/"
            element={<BlogListPage />}
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
                ? <CreateBlogPage />
                : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/users"
            element={<Users />}
          />

          <Route
            path="/users/:id"
            element={<User />}
          />

          <Route
            path="/blogs/:id"
            element={<BlogView />}
          />

          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </ErrorBoundary>
    </Container>
  )
}

export default App

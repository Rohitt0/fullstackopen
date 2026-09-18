import {
  AppBar,
  Button,
  Toolbar,
  Typography
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

import { useActions, useUser } from '../store'

const Navigation = () => {
  const user = useUser()
  const { logout } = useActions()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar sx={{ gap: 1, flexWrap: 'wrap' }}>
        <Typography
          component={Link}
          to="/"
          sx={{
            color: 'inherit',
            textDecoration: 'none',
            fontWeight: 'bold',
            mr: 1
          }}
        >
          Bloglist
        </Typography>

        <Button
          color="inherit"
          component={Link}
          to="/"
        >
          blogs
        </Button>

        <Button
          color="inherit"
          component={Link}
          to="/users"
        >
          users
        </Button>

        {user && (
          <Button
            color="inherit"
            component={Link}
            to="/create"
          >
            create
          </Button>
        )}

        <div style={{ flex: 1 }} />

        {user ? (
          <>
            <Typography
              component="span"
              sx={{
                display: { xs: 'none', sm: 'block' }
              }}
            >
              {user.name || user.username} logged in
            </Typography>

            <Button
              color="inherit"
              onClick={handleLogout}
            >
              logout
            </Button>
          </>
        ) : (
          <Button
            color="inherit"
            component={Link}
            to="/login"
          >
            login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navigation

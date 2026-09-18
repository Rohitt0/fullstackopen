import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography
} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'

const Navigation = ({ user, onLogout }) => {
  const navigate = useNavigate()

  const logout = () => {
    onLogout()
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

        {user && (
          <Button
            color="inherit"
            component={Link}
            to="/create"
          >
            create
          </Button>
        )}

        <Box sx={{ flexGrow: 1 }} />

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
              onClick={logout}
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

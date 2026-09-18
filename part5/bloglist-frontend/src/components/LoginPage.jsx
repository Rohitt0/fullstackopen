import { useState } from 'react'
import { Typography } from '@mui/material'

import LoginForm from './LoginForm'

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const submit = async event => {
    event.preventDefault()

    try {
      await onLogin({
        username,
        password
      })

      setUsername('')
      setPassword('')
    } catch {
      // App handles the error notification.
    }
  }

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Log in to application
      </Typography>

      <LoginForm
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        onSubmit={submit}
      />
    </div>
  )
}

export default LoginPage

import { Button, Stack, TextField } from '@mui/material'
import { useField } from '../hooks'

const LoginForm = ({ onSubmit }) => {
  const {
    reset: resetUsername,
    ...username
  } = useField('text')

  const {
    reset: resetPassword,
    ...password
  } = useField('password')

  const submit = async event => {
    event.preventDefault()

    await onSubmit({
      username: username.value,
      password: password.value
    })

    resetUsername()
    resetPassword()
  }

  return (
    <form onSubmit={submit}>
      <Stack spacing={2} sx={{ maxWidth: 420 }}>
        <TextField
          label="username"
          value={username.value}
          onChange={username.onChange}
          type="text"
          required
        />

        <TextField
          label="password"
          value={password.value}
          onChange={password.onChange}
          type="password"
          required
        />

        <Button
          variant="contained"
          type="submit"
        >
          login
        </Button>
      </Stack>
    </form>
  )
}

export default LoginForm

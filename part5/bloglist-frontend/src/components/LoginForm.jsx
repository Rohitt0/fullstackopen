import { Button, Stack, TextField } from '@mui/material'

const LoginForm = ({
  username,
  password,
  setUsername,
  setPassword,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={2} sx={{ maxWidth: 420 }}>
        <TextField
          label="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          autoComplete="username"
        />

        <TextField
          label="password"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          autoComplete="current-password"
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

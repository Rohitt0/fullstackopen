import { Typography } from '@mui/material'
import LoginForm from './LoginForm'

const LoginPage = ({ onLogin }) => (
  <div>
    <Typography variant="h4" sx={{ mb: 2 }}>
      login
    </Typography>

    <LoginForm onSubmit={onLogin} />
  </div>
)

export default LoginPage

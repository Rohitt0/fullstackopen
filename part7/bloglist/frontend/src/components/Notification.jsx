import { Alert } from '@mui/material'
import { useNotification } from '../store'

const Notification = () => {
  const notification = useNotification()

  if (!notification) {
    return null
  }

  return (
    <Alert
      severity={notification.type}
      sx={{ mb: 2 }}
    >
      {notification.message}
    </Alert>
  )
}

export default Notification

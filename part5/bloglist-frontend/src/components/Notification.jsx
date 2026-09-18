import { useEffect } from 'react'
import { Alert, Box } from '@mui/material'

const Notification = ({ notification, onClose }) => {
  useEffect(() => {
    if (!notification) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      onClose()
    }, 5000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [notification, onClose])

  if (!notification) {
    return null
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Alert
        severity={notification.type}
        onClose={onClose}
      >
        {notification.message}
      </Alert>
    </Box>
  )
}

export default Notification

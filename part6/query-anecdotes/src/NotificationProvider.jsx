import { useCallback, useState } from 'react'

import NotificationContext from './NotificationContext'

const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState('')

  const notify = useCallback(message => {
    setNotification(message)

    setTimeout(() => {
      setNotification('')
    }, 5000)
  }, [])

  return (
    <NotificationContext.Provider
      value={{ notification, notify }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationProvider
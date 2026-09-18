import {
  Stack,
  Typography
} from '@mui/material'

import { Link, useParams } from 'react-router-dom'
import { useUsers } from '../store'

const User = () => {
  const { id } = useParams()
  const users = useUsers()

  const user = users.find(user => user.id === id)

  if (!user) {
    return <div>loading user...</div>
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4">
        {user.name || user.username}
      </Typography>

      <Typography variant="h5">
        added blogs
      </Typography>

      {user.blogs.length === 0 ? (
        <Typography>
          no blogs yet
        </Typography>
      ) : (
        user.blogs.map(blog => (
          <Typography key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title}
            </Link>
          </Typography>
        ))
      )}
    </Stack>
  )
}

export default User

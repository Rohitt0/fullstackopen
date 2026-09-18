import { useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  Link as MuiLink,
  Stack,
  Typography
} from '@mui/material'
import { Link } from 'react-router-dom'

const Blog = ({
  blog,
  onLike,
  onRemove,
  canLike = false,
  canDelete = false
}) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const like = async () => {
    await onLike(blog)
  }

  const remove = async () => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}?`)) {
      await onRemove(blog)
    }
  }

  return (
    <Card
      data-testid="blog"
      variant="outlined"
      sx={{ backgroundColor: 'white' }}
    >
      <CardContent>
        <Typography
          className="blog-summary"
          component="div"
        >
          <MuiLink
            component={Link}
            className="blog-link"
            to={`/blogs/${blog.id}`}
            underline="hover"
          >
            {blog.title}
          </MuiLink>{' '}
          {blog.author}
        </Typography>

        <Button
          size="small"
          onClick={toggleVisibility}
          aria-label={
            visible
              ? `hide ${blog.title}`
              : `view ${blog.title}`
          }
          sx={{ mt: 1 }}
        >
          {visible ? 'hide' : 'view'}
        </Button>

        {visible && (
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            <Typography className="blog-url">
              {blog.url}
            </Typography>

            <Typography className="blog-likes">
              likes {blog.likes}
            </Typography>

            {blog.user && (
              <Typography>
                added by{' '}
                {blog.user.name || blog.user.username}
              </Typography>
            )}

            <Stack direction="row" spacing={1}>
              {canLike && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={like}
                >
                  like
                </Button>
              )}

              {canDelete && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={remove}
                >
                  remove
                </Button>
              )}
            </Stack>
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}

export default Blog

import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Button,
  Card,
  CardContent,
  Link as MuiLink,
  Stack,
  Typography
} from '@mui/material'

const SingleBlogPage = ({
  blogs,
  user,
  onLike,
  onRemove
}) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const blog = blogs.find(item => item.id === id)

  if (!blog) {
    return (
      <Stack spacing={2}>
        <Typography variant="h5">
          blog not found
        </Typography>

        <Button
          component={Link}
          to="/"
          variant="outlined"
        >
          back to blogs
        </Button>
      </Stack>
    )
  }

  const isCreator =
    user !== null &&
    blog.user?.id === user.id

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
      variant="outlined"
      sx={{
        backgroundColor: 'white',
        maxWidth: 700
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h4">
            {blog.title}
          </Typography>

          <Typography variant="h6">
            {blog.author}
          </Typography>

          <MuiLink
            href={blog.url}
            target="_blank"
            rel="noreferrer"
            className="blog-url"
          >
            {blog.url}
          </MuiLink>

          <Typography>
            likes {blog.likes}
          </Typography>

          {blog.user && (
            <Typography>
              added by{' '}
              {blog.user.name || blog.user.username}
            </Typography>
          )}

          {user && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                onClick={like}
              >
                like
              </Button>

              {isCreator && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={remove}
                >
                  remove
                </Button>
              )}
            </Stack>
          )}

          <Button
            variant="text"
            onClick={() => navigate('/')}
          >
            back to blogs
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default SingleBlogPage

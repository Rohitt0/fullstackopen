import {
  Button,
  Divider,
  List,
  ListItem,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { useField } from '../hooks'
import { useParams } from 'react-router-dom'

import {
  useActions,
  useBlogs,
  useUser
} from '../store'

const BlogView = () => {
  const { id } = useParams()
  const blogs = useBlogs()
  const user = useUser()
  const { likeBlog, removeBlog, addComment } = useActions()

  const blog = blogs.find(blog => blog.id === id)

  const {
    reset: resetComment,
    ...comment
  } = useField('text')

  if (!blog) {
    return <div>loading blog...</div>
  }

  const isCreator =
    user !== null &&
    blog.user?.id === user.id

  const submitComment = async event => {
    event.preventDefault()

    if (!comment.value.trim()) {
      return
    }

    await addComment(blog.id, comment.value)
    resetComment()
  }

  const remove = async () => {
    if (
      window.confirm(
        `Remove ${blog.title} by ${blog.author}?`
      )
    ) {
      await removeBlog(blog)
    }
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h4">
        {blog.title}
      </Typography>

      <Typography>
        {blog.author}
      </Typography>

      <Typography
        component="a"
        href={blog.url}
        target="_blank"
        rel="noreferrer"
      >
        {blog.url}
      </Typography>

      <Typography>
        likes {blog.likes}
      </Typography>

      {blog.user && (
        <Typography>
          added by {blog.user.name || blog.user.username}
        </Typography>
      )}

      {user && (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            onClick={() => likeBlog(blog)}
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

      <Divider />

      <Typography variant="h5">
        comments
      </Typography>

      <List>
        {(blog.comments || []).map((commentItem, index) => (
          <ListItem
            key={`${blog.id}-${index}`}
            divider
          >
            {commentItem.content}
          </ListItem>
        ))}
      </List>

      <form onSubmit={submitComment}>
        <Stack direction="row" spacing={1}>
          <TextField
            label="comment"
            size="small"
            value={comment.value}
            onChange={comment.onChange}
          />

          <Button
            type="submit"
            variant="contained"
          >
            add comment
          </Button>
        </Stack>
      </form>
    </Stack>
  )
}

export default BlogView

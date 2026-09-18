import { useState } from 'react'
import {
  Button,
  Stack,
  TextField,
  Typography
} from '@mui/material'

const BlogForm = ({ onCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [likes, setLikes] = useState('')

  const submit = async event => {
    event.preventDefault()

    await onCreate({
      title,
      author,
      url,
      likes: likes === '' ? 0 : Number(likes)
    })

    setTitle('')
    setAuthor('')
    setUrl('')
    setLikes('')
  }

  return (
    <form onSubmit={submit}>
      <Stack
        spacing={2}
        sx={{
          maxWidth: 560,
          p: 3,
          border: '1px solid #ddd',
          borderRadius: 2,
          backgroundColor: 'white'
        }}
      >
        <Typography variant="h5">
          create new blog
        </Typography>

        <TextField
          label="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          required
        />

        <TextField
          label="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />

        <TextField
          label="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          required
        />

        <TextField
          label="likes"
          type="number"
          value={likes}
          onChange={({ target }) => setLikes(target.value)}
        />

        <Button
          variant="contained"
          type="submit"
        >
          create
        </Button>
      </Stack>
    </form>
  )
}

export default BlogForm

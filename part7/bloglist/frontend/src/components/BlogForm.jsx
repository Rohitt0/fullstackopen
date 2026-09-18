import { Button, Stack, TextField } from '@mui/material'
import { useField } from '../hooks'

const BlogForm = ({ onCreate }) => {
  const {
    reset: resetTitle,
    ...title
  } = useField('text')

  const {
    reset: resetAuthor,
    ...author
  } = useField('text')

  const {
    reset: resetUrl,
    ...url
  } = useField('url')

  const submit = async event => {
    event.preventDefault()

    await onCreate({
      title: title.value,
      author: author.value,
      url: url.value,
      likes: 0
    })

    resetTitle()
    resetAuthor()
    resetUrl()
  }

  return (
    <form onSubmit={submit}>
      <Stack spacing={2} sx={{ maxWidth: 560 }}>
        <TextField
          label="title"
          value={title.value}
          onChange={title.onChange}
          required
        />

        <TextField
          label="author"
          value={author.value}
          onChange={author.onChange}
        />

        <TextField
          label="url"
          value={url.value}
          onChange={url.onChange}
          required
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

import { Typography } from '@mui/material'

import BlogForm from './BlogForm'
import { useActions } from '../store'

const CreateBlogPage = () => {
  const { createBlog } = useActions()

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        create new blog
      </Typography>

      <BlogForm
        onCreate={async blog => {
          await createBlog(blog)
        }}
      />
    </div>
  )
}

export default CreateBlogPage

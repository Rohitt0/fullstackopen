import { Typography } from '@mui/material'

import BlogForm from './BlogForm'

const CreateBlogPage = ({ onCreate }) => {
  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        create new blog
      </Typography>

      <BlogForm onCreate={onCreate} />
    </div>
  )
}

export default CreateBlogPage

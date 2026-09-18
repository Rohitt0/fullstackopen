import {
  Stack,
  Typography
} from '@mui/material'

import Blog from './Blog'

const BlogListPage = ({
  blogs,
  user,
  onLike,
  onRemove
}) => {
  const sortedBlogs = [...blogs].sort(
    (a, b) => b.likes - a.likes
  )

  return (
    <Stack spacing={2}>
      <Typography variant="h4">
        blogs
      </Typography>

      <div className="blog-list">
        {sortedBlogs.map(blog => (
          <Blog
            key={blog.id}
            blog={blog}
            onLike={onLike}
            onRemove={onRemove}
            canLike={user !== null}
            canDelete={
              user !== null &&
              blog.user?.id === user.id
            }
          />
        ))}
      </div>
    </Stack>
  )
}

export default BlogListPage

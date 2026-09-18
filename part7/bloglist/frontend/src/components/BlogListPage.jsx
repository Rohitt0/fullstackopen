import {
  Card,
  CardContent,
  Link as MuiLink,
  Stack,
  Typography
} from '@mui/material'
import { Link } from 'react-router-dom'

import { useBlogs, useUser } from '../store'

const BlogListPage = () => {
  const blogs = useBlogs()
  const user = useUser()

  return (
    <Stack spacing={2}>
      <Typography variant="h4">
        blogs
      </Typography>

      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map(blog => (
          <Card
            key={blog.id}
            variant="outlined"
          >
            <CardContent>
              <MuiLink
                component={Link}
                to={`/blogs/${blog.id}`}
                underline="hover"
                className="blog-link"
              >
                <Typography variant="h6">
                  {blog.title}
                </Typography>
              </MuiLink>

              <Typography>
                {blog.author}
              </Typography>

              <Typography>
                likes {blog.likes}
              </Typography>

              {blog.user && (
                <Typography variant="body2">
                  added by{' '}
                  {blog.user.name ||
                    blog.user.username}
                </Typography>
              )}

              {user && (
                <Typography
                  variant="body2"
                  sx={{ mt: 1 }}
                >
                  Open the blog to like or remove it.
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
    </Stack>
  )
}

export default BlogListPage

const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  return blogs.reduce(
    (sum, blog) => sum + blog.likes,
    0
  )
}

const favoriteBlog = blogs => {
  if (blogs.length === 0) {
    return undefined
  }

  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes
      ? blog
      : favorite
  })
}

const mostBlogs = blogs => {
  if (blogs.length === 0) {
    return undefined
  }

  const counts = {}

  blogs.forEach(blog => {
    counts[blog.author] =
      (counts[blog.author] || 0) + 1
  })

  return Object.entries(counts)
    .map(([author, blogs]) => ({
      author,
      blogs
    }))
    .sort((a, b) => b.blogs - a.blogs)[0]
}

const mostLikes = blogs => {
  if (blogs.length === 0) {
    return undefined
  }

  const likes = {}

  blogs.forEach(blog => {
    likes[blog.author] =
      (likes[blog.author] || 0) + blog.likes
  })

  return Object.entries(likes)
    .map(([author, likes]) => ({
      author,
      likes
    }))
    .sort((a, b) => b.likes - a.likes)[0]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
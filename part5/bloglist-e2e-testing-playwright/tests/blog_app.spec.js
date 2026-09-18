const {
  test,
  expect,
  beforeEach,
  describe
} = require('@playwright/test')

const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config({
  path: path.resolve(
    __dirname,
    '../../../part4/bloglist/.env.test'
  )
})

const databaseUrl = process.env.MONGODB_URI

let user

const resetDatabase = async () => {
  await mongoose.connect(databaseUrl)

  await mongoose.connection.db
    .collection('users')
    .deleteMany({})

  await mongoose.connection.db
    .collection('blogs')
    .deleteMany({})

  await mongoose.connection.close()
}

const createUser = async request => {
  const username =
    `user${Date.now()}${Math.floor(Math.random() * 1000)}`

  const password = 'password123'

  const response = await request.post(
    'http://localhost:3003/api/users',
    {
      data: {
        username,
        password,
        name: 'Test User'
      }
    }
  )

  expect(response.ok()).toBeTruthy()

  return {
    username,
    password
  }
}

const loginFromPage = async (page, credentials) => {
  await page.goto('/login')

  await page.getByLabel('username').fill(
    credentials.username
  )

  await page.getByLabel('password').fill(
    credentials.password
  )

  await page.getByRole('button', {
    name: 'login'
  }).click()

  await expect(
    page.getByRole('heading', {
      name: 'blogs'
    })
  ).toBeVisible()
}

const createBlog = async (request, credentials, data) => {
  const loginResponse = await request.post(
    'http://localhost:3003/api/login',
    {
      data: credentials
    }
  )

  expect(loginResponse.ok()).toBeTruthy()

  const loginBody = await loginResponse.json()

  const response = await request.post(
    'http://localhost:3003/api/blogs',
    {
      headers: {
        Authorization: `Bearer ${loginBody.token}`
      },
      data
    }
  )

  expect(response.ok()).toBeTruthy()

  return response.json()
}

const getBlogContainer = (page, title) => {
  return page
    .getByTestId('blog')
    .filter({
      hasText: title
    })
}

describe('Blog app', () => {
  beforeEach(async ({ request }) => {
    await resetDatabase()
    user = await createUser(request)
  })

  test('Login form is shown', async ({ page }) => {
    await page.goto('/login')

    await expect(
      page.getByRole('heading', {
        name: 'Log in to application'
      })
    ).toBeVisible()

    await expect(
      page.getByLabel('username')
    ).toBeVisible()

    await expect(
      page.getByLabel('password')
    ).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({
      page
    }) => {
      await loginFromPage(
        page,
        user
      )

      await expect(
        page.getByText('Test User logged in')
      ).toBeVisible()
    })

    test('fails with wrong credentials', async ({
      page
    }) => {
      await page.goto('/login')

      await page.getByLabel('username').fill(
        user.username
      )

      await page.getByLabel('password').fill(
        'wrongpassword'
      )

      await page.getByRole('button', {
        name: 'login'
      }).click()

      await expect(
        page.getByText(
          'invalid username or password'
        )
      ).toBeVisible()

      await expect(
        page.getByRole('heading', {
          name: 'Log in to application'
        })
      ).toBeVisible()
    })
  })

  describe('When logged in', () => {
    test('a new blog can be created', async ({
      page
    }) => {
      await loginFromPage(
        page,
        user
      )

      await page.getByRole('link', {
        name: 'create'
      }).click()

      await page.getByLabel('title').fill(
        'E2E Blog'
      )

      await page.getByLabel('author').fill(
        'E2E Author'
      )

      await page.getByLabel('url').fill(
        'https://example.com/e2e'
      )

      await page.getByLabel('likes').fill('0')

      await page.getByRole('button', {
        name: 'create'
      }).click()

      await expect(
        page.getByRole('link', {
          name: 'E2E Blog'
        })
      ).toBeVisible()
    })

    test('a blog can be liked', async ({
      page,
      request
    }) => {
      await createBlog(
        request,
        user,
        {
          title: 'Like E2E Blog',
          author: 'E2E Author',
          url: 'https://example.com/like',
          likes: 0
        }
      )

      await loginFromPage(
        page,
        user
      )

      const blog = getBlogContainer(
        page,
        'Like E2E Blog'
      )

      await blog.getByRole('button', {
        name: 'view Like E2E Blog'
      }).click()

      await expect(
        blog.getByText('likes 0')
      ).toBeVisible()

      await blog.getByRole('button', {
        name: 'like',
        exact: true
      }).click()

      await expect(
        blog.getByText('likes 1')
      ).toBeVisible()
    })

    test('the creator can delete a blog', async ({
      page,
      request
    }) => {
      await createBlog(
        request,
        user,
        {
          title: 'Delete E2E Blog',
          author: 'E2E Author',
          url: 'https://example.com/delete',
          likes: 0
        }
      )

      await loginFromPage(
        page,
        user
      )

      const blog = getBlogContainer(
        page,
        'Delete E2E Blog'
      )

      await blog.getByRole('button', {
        name: 'view Delete E2E Blog'
      }).click()

      await expect(
        blog.getByRole('button', {
          name: 'remove'
        })
      ).toBeVisible()

      page.once('dialog', async dialog => {
        await dialog.accept()
      })

      await blog.getByRole('button', {
        name: 'remove'
      }).click()

      await expect(
        page.getByRole('link', {
          name: 'Delete E2E Blog'
        })
      ).not.toBeVisible()
    })

    test('only the creator sees the delete button', async ({
      page,
      request
    }) => {
      const otherUser = await createUser(
        request
      )

      await createBlog(
        request,
        user,
        {
          title: 'Protected E2E Blog',
          author: 'Creator',
          url: 'https://example.com/protected',
          likes: 0
        }
      )

      await loginFromPage(
        page,
        otherUser
      )

      const blog = getBlogContainer(
        page,
        'Protected E2E Blog'
      )

      await blog.getByRole('button', {
        name: 'view Protected E2E Blog'
      }).click()

      await expect(
        blog.getByRole('button', {
          name: 'like'
        })
      ).toBeVisible()

      await expect(
        blog.getByRole('button', {
          name: 'remove'
        })
      ).not.toBeVisible()
    })

    test('blogs are sorted by likes', async ({
      page,
      request
    }) => {
      await createBlog(
        request,
        user,
        {
          title: 'Low Likes Blog',
          author: 'Author One',
          url: 'https://example.com/low',
          likes: 1
        }
      )

      await createBlog(
        request,
        user,
        {
          title: 'High Likes Blog',
          author: 'Author Two',
          url: 'https://example.com/high',
          likes: 10
        }
      )

      await createBlog(
        request,
        user,
        {
          title: 'Medium Likes Blog',
          author: 'Author Three',
          url: 'https://example.com/medium',
          likes: 5
        }
      )

      await loginFromPage(
        page,
        user
      )

      const blogLinks = page.locator(
        '.blog-link'
      )

      await expect(
        blogLinks.nth(0)
      ).toHaveText('High Likes Blog')

      await expect(
        blogLinks.nth(1)
      ).toHaveText('Medium Likes Blog')

      await expect(
        blogLinks.nth(2)
      ).toHaveText('Low Likes Blog')
    })
  })
})
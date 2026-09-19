import { test, expect } from '@playwright/test'
import { resetDatabase } from './test_helper.js'

const BROKEN_BLOG_ID = '000000000000000000000001'

const mockBrokenBlog = page =>
  page.route('**/api/blogs', route =>
    route.fulfill({
      json: [
        {
          id: BROKEN_BLOG_ID,
          title: 'A blog with broken comments',
          author: 'Test Author',
          url: 'http://example.com',
          likes: 0,
          comments: {},
          user: null
        }
      ]
    })
  )

test.describe('Error boundary', () => {
  test.beforeEach(async ({ request, page }) => {
    await resetDatabase(request)
    await mockBrokenBlog(page)
  })

  test('shows an error message when a rendering error occurs', async ({
    page
  }) => {
    await page.goto(`/blogs/${BROKEN_BLOG_ID}`)

    await expect(
      page.getByText(/something went wrong/i)
    ).toBeVisible()
  })

  test('navigation remains usable outside the error boundary', async ({
    page
  }) => {
    await page.goto(`/blogs/${BROKEN_BLOG_ID}`)

    const blogsLink = page.getByRole('link', {
      name: 'blogs',
      exact: true
    })

    await expect(blogsLink).toBeVisible()

    await blogsLink.click()

    await expect(page).toHaveURL('/')
  })
})
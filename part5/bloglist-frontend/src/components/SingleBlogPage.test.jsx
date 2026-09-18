import { describe, expect, test, vi } from 'vitest'
import {
  render,
  screen
} from '@testing-library/react'
import {
  MemoryRouter,
  Route,
  Routes
} from 'react-router-dom'

import SingleBlogPage from './SingleBlogPage'

const blog = {
  id: '123',
  title: 'The Blog',
  author: 'John Doe',
  url: 'https://example.com/blog',
  likes: 7,
  user: {
    id: 'user-1',
    username: 'john',
    name: 'John Doe'
  }
}

const renderPage = user => {
  return render(
    <MemoryRouter initialEntries={['/blogs/123']}>
      <Routes>
        <Route
          path="/blogs/:id"
          element={
            <SingleBlogPage
              blogs={[blog]}
              user={user}
              onLike={vi.fn()}
              onRemove={vi.fn()}
            />
          }
        />
      </Routes>
    </MemoryRouter>
  )
}

describe('SingleBlogPage', () => {
  test('unauthenticated users see information but no buttons', () => {
    renderPage(null)

    expect(
      screen.getByText('The Blog')
    ).toBeInTheDocument()

    expect(
      screen.getByText('likes 7')
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('button', {
        name: 'like'
      })
    ).not.toBeInTheDocument()

    expect(
      screen.queryByRole('button', {
        name: 'remove'
      })
    ).not.toBeInTheDocument()
  })

  test('authenticated non-creators see only the like button', () => {
    renderPage({
      id: 'other-user',
      username: 'other',
      name: 'Other User'
    })

    expect(
      screen.getByRole('button', {
        name: 'like'
      })
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('button', {
        name: 'remove'
      })
    ).not.toBeInTheDocument()
  })

  test('the creator sees both like and remove buttons', () => {
    renderPage({
      id: 'user-1',
      username: 'john',
      name: 'John Doe'
    })

    expect(
      screen.getByRole('button', {
        name: 'like'
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: 'remove'
      })
    ).toBeInTheDocument()
  })
})
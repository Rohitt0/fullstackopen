import { describe, expect, test, vi } from 'vitest'
import {
  fireEvent,
  render,
  screen
} from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import Blog from './Blog'

const blog = {
  title: 'The Blog',
  author: 'John Doe',
  url: 'https://example.com/blog',
  likes: 7,
  id: '123',
  user: {
    id: 'user-1',
    username: 'john',
    name: 'John Doe'
  }
}

const renderBlog = props => {
  return render(
    <MemoryRouter>
      <Blog
        blog={blog}
        onLike={vi.fn()}
        onRemove={vi.fn()}
        {...props}
      />
    </MemoryRouter>
  )
}

describe('Blog component', () => {
  test('renders title and author but not url or likes by default', () => {
    renderBlog()

    expect(screen.getByText('The Blog')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()

    expect(
      screen.queryByText('https://example.com/blog')
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText('likes 7')
    ).not.toBeInTheDocument()
  })

  test('shows url and likes when view button is clicked', () => {
    renderBlog()

    fireEvent.click(
      screen.getByRole('button', {
        name: 'view The Blog'
      })
    )

    expect(
      screen.getByText('https://example.com/blog')
    ).toBeInTheDocument()

    expect(
      screen.getByText('likes 7')
    ).toBeInTheDocument()
  })

  test('calls the like handler twice when like is clicked twice', () => {
    const onLike = vi.fn()

    renderBlog({
      onLike,
      canLike: true
    })

    fireEvent.click(
      screen.getByRole('button', {
        name: 'view The Blog'
      })
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'like'
      })
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'like'
      })
    )

    expect(onLike).toHaveBeenCalledTimes(2)
  })
})
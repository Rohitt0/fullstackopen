import { describe, expect, test, vi } from 'vitest'
import {
  fireEvent,
  render,
  screen
} from '@testing-library/react'

import BlogForm from './BlogForm'

describe('BlogForm', () => {
  test('calls onCreate with the correct details', () => {
    const onCreate = vi.fn()

    render(
      <BlogForm onCreate={onCreate} />
    )

    fireEvent.change(
      screen.getByRole('textbox', {
        name: /title/i
      }),
      {
        target: {
          value: 'New Blog'
        }
      }
    )

    fireEvent.change(
      screen.getByRole('textbox', {
        name: /author/i
      }),
      {
        target: {
          value: 'New Author'
        }
      }
    )

    fireEvent.change(
      screen.getByRole('textbox', {
        name: /url/i
      }),
      {
        target: {
          value: 'https://example.com/new'
        }
      }
    )

    fireEvent.change(
      screen.getByRole('spinbutton', {
        name: /likes/i
      }),
      {
        target: {
          value: '12'
        }
      }
    )

    fireEvent.click(
      screen.getByRole('button', {
        name: 'create'
      })
    )

    expect(onCreate).toHaveBeenCalledWith({
      title: 'New Blog',
      author: 'New Author',
      url: 'https://example.com/new',
      likes: 12
    })
  })
})
// @vitest-environment jsdom

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const mockAnecdotes = [
  {
    id: '1',
    content: 'first anecdote',
    votes: 5
  },
  {
    id: '2',
    content: 'second anecdote',
    votes: 10
  },
  {
    id: '3',
    content: 'third anecdote',
    votes: 2
  }
]

vi.mock('../store', () => ({
  useAnecdotes: () => mockAnecdotes,
  useAnecdoteActions: () => ({
    vote: vi.fn(),
    deleteAnecdote: vi.fn()
  })
}))

import AnecdoteList from './AnecdoteList'

describe('AnecdoteList', () => {
  it('renders anecdotes in descending order by votes', () => {
    render(<AnecdoteList />)

    const anecdotes = screen.getAllByText(
      /first anecdote|second anecdote|third anecdote/
    )

    expect(anecdotes[0].textContent).toBe('second anecdote')
    expect(anecdotes[1].textContent).toBe('first anecdote')
    expect(anecdotes[2].textContent).toBe('third anecdote')
  })
})
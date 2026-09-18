// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    deleteAnecdote: vi.fn()
  }
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotes } from './store'

beforeEach(() => {
  useAnecdoteStore.setState({
    anecdotes: [],
    filter: '',
    notification: ''
  })

  vi.clearAllMocks()
})

describe('anecdote store', () => {
  it('initializes anecdotes from the backend', async () => {
    const mockAnecdotes = [
      {
        id: '1',
        content: 'Test anecdote',
        votes: 5
      },
      {
        id: '2',
        content: 'Another anecdote',
        votes: 2
      }
    ]

    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    await useAnecdoteStore.getState().actions.initialize()

    expect(useAnecdoteStore.getState().anecdotes).toEqual(
      mockAnecdotes
    )
  })

  it('returns only anecdotes matching the filter', () => {
    const mockAnecdotes = [
      {
        id: '1',
        content: 'Real artists ship code',
        votes: 7
      },
      {
        id: '2',
        content: 'Untested code is broken code',
        votes: 3
      },
      {
        id: '3',
        content: 'Simplicity is the ultimate sophistication',
        votes: 5
      }
    ]

    useAnecdoteStore.setState({
      anecdotes: mockAnecdotes,
      filter: 'code',
      notification: ''
    })

    const { result } = renderHook(() => useAnecdotes())

    expect(result.current).toEqual([
      mockAnecdotes[0],
      mockAnecdotes[1]
    ])
  })

  it('increases the vote count when an anecdote is voted for', async () => {
    const anecdote = {
      id: '1',
      content: 'Test anecdote',
      votes: 2
    }

    useAnecdoteStore.setState({
      anecdotes: [anecdote],
      filter: '',
      notification: ''
    })

    const updatedAnecdote = {
      ...anecdote,
      votes: 3
    }

    anecdoteService.update.mockResolvedValue(updatedAnecdote)

    await useAnecdoteStore.getState().actions.vote('1')

    expect(useAnecdoteStore.getState().anecdotes).toEqual([
      updatedAnecdote
    ])
  })
})
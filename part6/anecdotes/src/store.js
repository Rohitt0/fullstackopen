import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  notification: '',

  actions: {
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()

      set(() => ({
        anecdotes
      }))
    },

    vote: async id => {
      const anecdote = get().anecdotes.find(a => a.id === id)

      const updatedAnecdote = {
        ...anecdote,
        votes: anecdote.votes + 1
      }

      const savedAnecdote = await anecdoteService.update(
        id,
        updatedAnecdote
      )

      set(state => ({
        anecdotes: state.anecdotes.map(anecdote =>
          anecdote.id === id ? savedAnecdote : anecdote
        ),
        notification: `you voted '${savedAnecdote.content}'`
      }))

      setTimeout(() => {
        set({ notification: '' })
      }, 5000)
    },

    createAnecdote: async content => {
      const newAnecdote = await anecdoteService.createNew(content)

      set(state => ({
        anecdotes: state.anecdotes.concat(newAnecdote),
        notification: `you added '${newAnecdote.content}'`
      }))

      setTimeout(() => {
        set({ notification: '' })
      }, 5000)
    },

    deleteAnecdote: async id => {
      await anecdoteService.deleteAnecdote(id)

      set(state => ({
        anecdotes: state.anecdotes.filter(anecdote => anecdote.id !== id)
      }))
    },

    setFilter: value => {
      set(() => ({
        filter: value
      }))
    }
  }
}))

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore(state => state.anecdotes)
  const filter = useAnecdoteStore(state => state.filter)

  const filteredAnecdotes = anecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )

  return filteredAnecdotes
}

export const useAnecdoteActions = () =>
  useAnecdoteStore(state => state.actions)

export const useNotification = () =>
  useAnecdoteStore(state => state.notification)

export default useAnecdoteStore
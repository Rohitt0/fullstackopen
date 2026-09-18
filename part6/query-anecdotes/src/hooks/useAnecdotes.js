import {
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'

import {
  createAnecdote,
  getAnecdotes,
  updateAnecdote
} from '../requests'

const useAnecdotes = notify => {
  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false
  })

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,

    onSuccess: newAnecdote => {
      queryClient.invalidateQueries({
        queryKey: ['anecdotes']
      })

      notify(`you created '${newAnecdote.content}'`)
    },

    onError: error => {
      notify(error.message)
    }
  })

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,

    onSuccess: updatedAnecdote => {
      queryClient.invalidateQueries({
        queryKey: ['anecdotes']
      })

      notify(`you voted '${updatedAnecdote.content}'`)
    }
  })

  const addAnecdote = content => {
    newAnecdoteMutation.mutate({
      content,
      votes: 0
    })
  }

  const voteAnecdote = anecdote => {
    voteMutation.mutate({
      ...anecdote,
      votes: anecdote.votes + 1
    })
  }

  return {
    anecdotes: result.data,
    isPending: result.isPending,
    isError: result.isError,
    addAnecdote,
    voteAnecdote
  }
}

export default useAnecdotes
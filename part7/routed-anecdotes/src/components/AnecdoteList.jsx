import { useAnecdotes } from '../hooks'

const AnecdoteList = () => {
  const { anecdotes, deleteAnecdote } = useAnecdotes()

  return (
    <ul>
      {anecdotes.map(anecdote => (
        <li key={anecdote.id}>
          <div>{anecdote.content}</div>

          <div>
            has {anecdote.votes}

            <button>vote</button>

            <button
              onClick={() => deleteAnecdote(anecdote.id)}
            >
              delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default AnecdoteList
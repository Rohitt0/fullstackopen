import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import useAnecdotes from './hooks/useAnecdotes'
import useNotify from './hooks/useNotify'

const App = () => {
  const { notify } = useNotify()

  const {
    anecdotes,
    isPending,
    isError,
    addAnecdote,
    voteAnecdote
  } = useAnecdotes(notify)

  if (isPending) {
    return <div>loading data...</div>
  }

  if (isError) {
    return (
      <div>
        anecdote service not available due to problems in server
      </div>
    )
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />

      <AnecdoteForm addAnecdote={addAnecdote} />

      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>

          <div>
            has {anecdote.votes}

            <button onClick={() => voteAnecdote(anecdote)}>
              vote
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
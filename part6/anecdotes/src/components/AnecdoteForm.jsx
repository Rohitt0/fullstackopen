import { useAnecdoteActions } from '../store'

const AnecdoteForm = () => {
  const { createAnecdote } = useAnecdoteActions()

  const create = async event => {
    event.preventDefault()

    const content = event.target.anecdote.value.trim()

    if (content.length === 0) return

    await createAnecdote(content)

    event.target.reset()
  }

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={create}>
        <div>
          <input name="anecdote" data-testid="new" />
        </div>

        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
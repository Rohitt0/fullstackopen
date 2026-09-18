const AnecdoteForm = ({ addAnecdote }) => {
  const onCreate = event => {
    event.preventDefault()

    const content = event.target.anecdote.value.trim()

    addAnecdote(content)

    event.target.reset()
  }

  return (
    <div>
      <h3>create new</h3>

      <form onSubmit={onCreate}>
        <input name="anecdote" />

        <button type="submit">
          create
        </button>
      </form>
    </div>
  )
}

export default AnecdoteForm
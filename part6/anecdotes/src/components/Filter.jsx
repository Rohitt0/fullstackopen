import { useAnecdoteActions } from '../store'

const Filter = () => {
  const { setFilter } = useAnecdoteActions()

  const handleChange = event => {
    setFilter(event.target.value)
  }

  return (
    <div>
      filter{' '}
      <input
        data-testid="filter"
        onChange={handleChange}
      />
    </div>
  )
}

export default Filter
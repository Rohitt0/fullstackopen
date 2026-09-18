import { useFeedbackStore } from '../store'

const Buttons = () => {
  const giveGood = useFeedbackStore(state => state.giveGood)
  const giveNeutral = useFeedbackStore(state => state.giveNeutral)
  const giveBad = useFeedbackStore(state => state.giveBad)

  return (
    <div>
      <h2>give feedback</h2>

      <button onClick={giveGood}>
        good
      </button>

      <button onClick={giveNeutral}>
        neutral
      </button>

      <button onClick={giveBad}>
        bad
      </button>
    </div>
  )
}

export default Buttons
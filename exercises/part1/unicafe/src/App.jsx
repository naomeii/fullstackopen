import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Rating = (props) => (
  <>
  {props.text} {props.rate}
  <br></br>
  </>
)

const Stats = (props) => (
  <>
  {props.text} {props.rate}
  <br></br>
  </>
)

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const averageValue = (total) => {
    if (total === 0){
      return 0;
    }
    return (good - bad) / total

  }

  const positive = (total) => {
    if (total === 0){
      return 0;
    }
    return (good / total) * 100

  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <h1>statistics</h1>
      <Rating rate={good} text="good" />
      <Rating rate={neutral} text="neutral" />
      <Rating rate={bad} text="bad" />
      <Stats rate={good + neutral + bad} text="all" />
      <Stats rate={averageValue(good + neutral + bad)} text="average" />
      <Stats rate={positive(good + neutral + bad)} text="positive" />
    </div>
  )
}

export default App

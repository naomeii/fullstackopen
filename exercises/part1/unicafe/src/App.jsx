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

const Statistics = (props) => (
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

    // Render statistics only if feedback has been gathered
    const renderStatistics = () => {
      if (good + neutral + bad === 0) {
        return (
          <p>No feedback given</p>
        );
      }
      return (
        <>
          <Statistics rate={good} text="good" />
          <Statistics rate={neutral} text="neutral" />
          <Statistics rate={bad} text="bad" />
          <Statistics rate={good + neutral + bad} text="all" />
          <Statistics rate={averageValue(good + neutral + bad)} text="average" />
          <Statistics rate={positive(good + neutral + bad)} text="positive" />
        </>
      );
    };


  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <h1>statistics</h1>
        {renderStatistics()}
    </div>
  )
}

export default App

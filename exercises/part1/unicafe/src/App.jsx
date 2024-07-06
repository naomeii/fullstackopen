import { useState } from 'react'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const StatisticLine = (props) => (
  <tr>
    <td>{props.text}</td>
    <td>{props.value}</td>
  </tr>
)


const Statistics = (props) => {
  const averageValue = (total) => {
    if (total === 0){
      return 0;
    }
    return (props.good - props.bad) / total

  }

  const positive = (total) => {
    if (total === 0){
      return 0;
    }
    return ((props.good / total) * 100) + ' %'

  }
  return(
    <div>
      <table>
        <tbody>
          <StatisticLine value={props.good} text="good" />
          <StatisticLine value={props.neutral} text="neutral" />
          <StatisticLine value={props.bad} text="bad" />
          <StatisticLine value={props.good + props.neutral + props.bad} text="all" />
          <StatisticLine value={averageValue(props.good + props.neutral + props.bad)} text="average" />
          <StatisticLine value={positive(props.good + props.neutral + props.bad)} text="positive" />
          </tbody>
      </table>
    </div>
  );
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

    // Render statistics only if feedback has been gathered
    const renderStatistics = () => {
      if (good + neutral + bad === 0) {
        return (
          <p>No feedback given</p>
        );
      }
      return (
        <>
          <Statistics good={good} neutral={neutral} bad={bad} />
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

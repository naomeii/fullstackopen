import { useSelector, useDispatch } from 'react-redux'
import { voteRequest } from '../reducers/anecdoteReducer'
import { addNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const dispatch = useDispatch()

    // console.log({ anecdotes, filter })

    const currState = useSelector(({ anecdotes, filter }) => {
      if ( filter === '') {
        return anecdotes
      }
      return anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
    })

    const vote = (anecdote) => {
      dispatch(voteRequest(anecdote))

      // notifications.6.19
      dispatch(addNotification(`you voted '${anecdote.content}'`, 10))
      // dispatch(createNotification(anecdote.id))
      // setTimeout(() => {dispatch(clearNotification())}, 5000)
    }

    const sortedAnecdotes = [...currState].sort((a1, a2) => a2.votes - a1.votes)

    return (
        <>
        {sortedAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
         )}
        
        </>
    )
}

export default AnecdoteList
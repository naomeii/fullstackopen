import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { clearNotification, createNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const dispatch = useDispatch()

    // console.log({ anecdotes, filter })

    const currState = useSelector(({ anecdotes, filter }) => {
      if ( filter === '') {
        return anecdotes
      }
      return anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
    })

    const vote = (id) => {
      console.log('vote', id)
      dispatch(addVote(id))
      dispatch(createNotification(id))
      setTimeout(() => {dispatch(clearNotification())}, 5000)
    }  

    return (
        <>
        {currState.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
         )}
        
        </>
    )
}

export default AnecdoteList
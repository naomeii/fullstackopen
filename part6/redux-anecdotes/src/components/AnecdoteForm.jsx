import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { addNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {

    const dispatch = useDispatch()
  
    const addAnecdote = async (event) => {
      event.preventDefault()
      
      const content = event.target.anecdote.value
      event.target.anecdote.value = ''
  
    //   // dispatch(createAnecdote(content))
    //   const newAnecdoteToBackend = await anecdoteService.createNew(content)
    //   dispatch(createAnecdote(newAnecdoteToBackend))
    // pushing to backend abstracted
      dispatch(createAnecdote(content))

      // // dispatch notification
      // dispatch(setNotification(content))
      // setTimeout(() => {dispatch(clearNotification())}, 5000)
      dispatch(addNotification(`'${content}' was added`, 10))
    }
    
    return (
        <>
        <h2>create new</h2>
        <form onSubmit={addAnecdote}>
            <div><input name='anecdote'/></div>
            <button type="submit">create</button>
        </form>
        </>
    )
}

export default AnecdoteForm
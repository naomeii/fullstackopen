import { useSelector } from 'react-redux'

const Notification = () => {

  const notification = useSelector(({ anecdotes, notification }) => {
    // console.log('anecdotes:', anecdotes, 'notif:', notification)
    if (!notification) {
      return null
    }

    const votedFor = anecdotes.find(anecdote => anecdote.id === notification)

    if (!votedFor) {
      return `'${notification}' was created`
    }

    const message = `you voted '${votedFor.content}'`
    return message
    
  })

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }
  return notification ? (
    <div style={style}>
      {notification}
    </div>
  ) : null
}
  
  export default Notification
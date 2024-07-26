import { useState } from 'react'
import { useNotificationDispatch } from '../NotificationContext'

const BlogForm = ({ createBlog }) => {
  // blog states
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const dispatch = useNotificationDispatch()

  const addBlog = async (event) => {
    // now add title, author, url states to our blogs state
    event.preventDefault()

    createBlog({
      title, author, url
    })

    dispatch({ type: 'MESSAGE', payload: `a new blog ${title} by ${author} added` })
    setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, 5000)

    // reset states
    setTitle('')
    setAuthor('')
    setUrl('')

  }


  return (
    <form onSubmit={addBlog}>
      <h1>create new</h1>
      <div>
      title:
        <input
          type="text"
          value={title}
          name="Title"
          placeholder='title'
          data-testid='title'
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
      author:
        <input
          type="text"
          value={author}
          name="Author"
          placeholder='author'
          data-testid='author'
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
      url:
        <input
          type="text"
          value={url}
          name="Url"
          placeholder='url'
          data-testid='url'
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>

  )
}

export default BlogForm
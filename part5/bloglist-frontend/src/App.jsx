import { useState, useEffect, useRef } from 'react'

import LoginHeader from './components/Loginheader'
import Showblogs from './components/Showblogs'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

import blogService from './services/blogs'
import loginService from './services/login'
import { useNotificationDispatch, useNotificationValue } from './NotificationContext'


const App = () => {
  const [blogs, setBlogs] = useState([])

  // login states
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  // app checks if logged in user can be found in local storage
  // if yes, save details to the state of the application and noteService
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, []) // [] ensures this only gets executed when page is rendered for the first time


  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h1>log in to application :D</h1>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const handleLogout = () => {
    // clears logged in user from local storage
    window.localStorage.removeItem('loggedBlogUser')
    // clears user
    setUser(null)
  }

  const dispatch = useNotificationDispatch()
  const messageValue = useNotificationValue()

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      // saves the logged in user to local storage. Obj is parsed to JSON with JSON.stringify
      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      dispatch({ type: 'MESSAGE', payload: 'wrong credentials' })
      setTimeout(() => {
        dispatch({ type: 'CLEAR' })
      }, 5000)
    }
  }

  const addBlog = (addBlog) => {
    // hide create new blog form after creating a new blog
    blogFormRef.current.toggleVisibility()

    blogService
      .create(addBlog)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })
  }

  const blogFormRef = useRef()

  const blogForm = () => (
    <Togglable buttonLabel='create new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const deleteBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){
      blogService.deleteBlog(blog.id)
        .then(() => {
          // setErrorMessage(
          //   `${blog.title} was removed from server`
          // )
          // setTimeout(() => {
          //   setErrorMessage(null)
          // }, 5000)
          dispatch({ type: 'MESSAGE', payload: `${blog.title} was removed from server` })
          setTimeout(() => {
            dispatch({ type: 'CLEAR' })
          }, 5000)
          setBlogs(blogs.filter(b => b.id !== blog.id))
        })
        .catch(error => {
          dispatch({ type: 'MESSAGE', payload: `Error deleting ${blog.title}: ${error}` })
          setTimeout(() => {
            dispatch({ type: 'CLEAR' })
          }, 5000)

        })
    }
  }

  const updateLikes = async (blog) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }

    blogService
      .update(updatedBlog.id, updatedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : returnedBlog))
      })
      .catch(() => {
        dispatch({ type: 'MESSAGE', payload: 'blog was already removed from server' })
        setTimeout(() => {
          dispatch({ type: 'CLEAR' })
        }, 5000)
        setBlogs(blogs.filter(b => b.id !== updatedBlog.id))
      })
  }


  return (
    <div>
      {user === null ?
        loginForm() :
        <div>
          <LoginHeader user={user} handleLogout={handleLogout} blogForm={blogForm} errorMessage={messageValue}/>
          <Showblogs blogs={blogs} updateLikes={updateLikes} deleteBlog={deleteBlog} loggedInUser={user}/>
        </div>
      }
    </div>
  )
}

export default App
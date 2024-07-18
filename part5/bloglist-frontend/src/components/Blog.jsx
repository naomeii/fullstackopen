import { useState } from 'react'
import blogs from '../services/blogs'

const Blog = ({ blog, updateLikes, deleteBlog, loggedInUser }) => {
  // controls if the details are being displayed or not
  const [blogVisible, setBlogVisible] = useState(false)

  const hideWhenVisible = { display: blogVisible ? 'none' : '' }
  const showWhenVisible = { display: blogVisible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>

      <div style={hideWhenVisible}>
        {blog.title} {blog.author + ' '}
        <button onClick={() => setBlogVisible(true)}>view</button>
      </div>

      <div style={showWhenVisible}>
      {blog.title} {blog.author + ' '}
      <button onClick={() => setBlogVisible(false)}>hide</button>  
      <br />
      {blog.url}
      <br />
      likes {blog.likes}
      <button onClick={() => updateLikes(blog)}>like</button>  
      <br />
      {/* {console.log('blog is', blog)} */}
      {blog.user.name}
      <br />
      {/* {console.log(blog)} */}
      {loggedInUser && blog.user.name === loggedInUser.name && (
          <button onClick={() => deleteBlog(blog)}>remove</button>
      )}      
      </div>

  </div>
)
}

export default Blog
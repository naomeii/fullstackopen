import { useState } from 'react'

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
    <div style={blogStyle} className='allBlogs'>

      <div style={hideWhenVisible} className="defaultBlogDisplay">
        {blog.title} {blog.author + ' '}
        <button onClick={() => setBlogVisible(true)}>view</button>
      </div>

      <div style={showWhenVisible} className="expandedBlogDisplay">
        {blog.title} {blog.author + ' '}
        <button onClick={() => setBlogVisible(false)}>hide</button>
        <br />
        {blog.url}
        <br />
      likes {blog.likes}
        <button onClick={() => updateLikes(blog)}>like</button>
        <br />
        {blog.user.name}
        <br />
        {blog.user.name === loggedInUser.name && (
          <button onClick={() => deleteBlog(blog)}>remove</button>
        )}
      </div>

    </div>
  )
}

export default Blog
import Blog from './Blog'
import PropTypes from 'prop-types'

const Showblogs = ({ blogs, updateLikes, deleteBlog, loggedInUser }) => {
  // (a, b) => a - b sorts numbers in ascending order.
  // (a, b) => b - a sorts numbers in descending order.

  const sortedBlogs = blogs.sort((a,b) => b.likes - a.likes)
  return (
    <>
      {sortedBlogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateLikes={updateLikes} deleteBlog={deleteBlog} loggedInUser={loggedInUser}/>
      )}
    </>
  )
}


Showblogs.propTypes = {
  blogs: PropTypes.array.isRequired,
  updateLikes: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired,
}

export default Showblogs
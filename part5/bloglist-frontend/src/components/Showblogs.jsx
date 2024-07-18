import Blog from './Blog'

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
  );
}

export default Showblogs
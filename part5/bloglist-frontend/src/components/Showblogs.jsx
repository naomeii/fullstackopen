import Blog from './Blog'

const Showblogs = ({ blogs }) => {
  return (
    <>
      {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
      )}
    </>
  );
}

export default Showblogs
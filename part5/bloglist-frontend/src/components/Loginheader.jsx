import Notification from './Notification'


const LoginHeader = ({ user, handleLogout, blogForm, errorMessage }) => {
  return (
    <>
      <h1>blogs</h1>
      <Notification message={errorMessage} />
      <p>
        {user.name || user.username} is logged in
        <button onClick={handleLogout}>Log Out</button>
      </p>
      <br />
      {blogForm()}
    </>
  )
}

export default LoginHeader
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('5.13 checks blog renders only title and author initially', () => {
  const blog =   {
    'title': 'refactored blogform',
    'author': 'by matt',
    'url': 'google.com',
    'likes': 10,
    'user': {
      'username': 'mluukkai',
      'name': 'Matti Luukkainen',
      'id': '6695b8887acce86da28602bb'
    },
  }

  const mockHandler = vi.fn()

  const { container } = render(<Blog
    blog={blog} updateLikes={mockHandler} deleteBlog={mockHandler} loggedInUser={blog.user}/>)

  // screen.debug()
  const div = container.querySelector('.defaultBlogDisplay')
  // console.log(div)

  expect(div).toHaveTextContent('refactored blogform')
  expect(div).toHaveTextContent('by matt')
  expect(div).not.toHaveTextContent('google.com')
  expect(div).not.toHaveTextContent('10')

})

test('5.14 checks blog URL and Likes are shwon when button is pressed', async () => {
  const blog =   {
    'title': 'refactored blogform',
    'author': 'by matt',
    'url': 'google.com',
    'likes': 10,
    'user': {
      'username': 'mluukkai',
      'name': 'Matti Luukkainen',
      'id': '6695b8887acce86da28602bb'
    },
  }

  const mockHandler = vi.fn()

  const { container } = render(<Blog
    blog={blog} updateLikes={mockHandler} deleteBlog={mockHandler} loggedInUser={blog.user}
  />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  // const div = await screen.findByText('google.com');
  // console.log(div)

  const div = container.querySelector('.expandedBlogDisplay')
  expect(div).toHaveTextContent('google.com')
  expect(div).toHaveTextContent('10')
  // console.log(div)

})

test('5.15 hitting like button 2x calls event handler 2x', async () => {
  const blog =   {
    'title': 'refactored blogform',
    'author': 'by matt',
    'url': 'google.com',
    'likes': 10,
    'user': {
      'username': 'mluukkai',
      'name': 'Matti Luukkainen',
      'id': '6695b8887acce86da28602bb'
    },
  }

  const mockHandler = vi.fn()

  const { container } = render(<Blog
    blog={blog} updateLikes={mockHandler} deleteBlog={mockHandler} loggedInUser={blog.user}
  />)

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)

})
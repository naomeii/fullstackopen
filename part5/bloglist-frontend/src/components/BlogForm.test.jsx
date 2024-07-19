import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('5.16 blogform calls the event handler it receiveed as props with the correct details when a blog is created', async () => {
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
  const mockSetter = vi.fn()

  const user = userEvent.setup()


  render(
    <BlogForm createBlog={mockHandler} setErrorMessage={mockSetter}/>)

  // const input = screen.getByRole('textbox') // accesses input field
  // const inputs = screen.getAllByRole('textbox') // used for multiple input fields
  const title = screen.getByPlaceholderText('title') // best method so order doesn't matter
  const author = screen.getByPlaceholderText('author') // best method so order doesn't matter
  const url = screen.getByPlaceholderText('url') // best method so order doesn't matter

  const sendButton = screen.getByText('create')

  // await user.type(input, 'testing a form...')
  // await user.type(inputs[0], 'testing a form...')
  await userEvent.type(title, 'refactored blogform')
  await userEvent.type(author, 'by matt')
  await userEvent.type(url, 'google.com')

  await user.click(sendButton)

  // console.log(mockHandler.mock.calls)
  // prints
  //   [
  //   [
  //     {
  //       title: 'refactored blogform',
  //       author: 'by matt',
  //       url: 'google.com'
  //     }
  //   ]
  // ]


  // ensures that submitting the form calls the mockHandler ONCE
  expect(mockHandler.mock.calls).toHaveLength(1)

  // checks that the evt handler is called with the right parameters aka
  // a blog with the correct content is created when a form is filled
  expect(mockHandler.mock.calls[0][0].title).toBe('refactored blogform')
  expect(mockHandler.mock.calls[0][0].author).toBe('by matt')
  expect(mockHandler.mock.calls[0][0].url).toBe('google.com')

})
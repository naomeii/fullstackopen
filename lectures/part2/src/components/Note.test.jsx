import { render, screen } from '@testing-library/react'
import Note from './Note'
import userEvent from '@testing-library/user-event'

test('does not render this', () => {
  const note = {
    content: 'This is a reminder',
    important: true
  }

  render(<Note note={note} />)

  // does not cause an exception if it is not found so we can compare null
  const element = screen.queryByText('do not want this thing to be rendered')
  expect(element).toBeNull()
})

test('renders content but not exact', () => {
  const note = {
    content: 'Does not work anymore :(',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText(
    'Does not work anymore :(', { exact: false }
  )
  // OR
  // const element = await screen.findByText('Does not work anymore :(')

  expect(element).toBeDefined()
})

// test('renders content', () => {
//   const note = {
//     content: 'Component testing is done with react-testing-library',
//     important: true
//   }

//   // // using css-selectors to find rendered elements
//   // const { container } = render(<Note note={note} />)

//   // const div = container.querySelector('.note')
//   // expect(div).toHaveTextContent(
//   //   'Component testing is done with react-testing-library'
//   // )

//   render(<Note note={note} />)

//   // prints HTML to the terminal console for us
//   screen.debug()

//   // we can also use it to print a wanted element
//   const element = screen.getByText('Component testing is done with react-testing-library')
//   screen.debug(element)
//   expect(element).toBeDefined()

// })

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  // a mock function defined with Vitest
  const mockHandler = vi.fn()

  render(
    <Note note={note} toggleImportance={mockHandler} />
  )

  const user = userEvent.setup() // a session is started to interact with the rendered component
  // finds the button based on the text from the rendered component and clicks the element
  const button = screen.getByText('make not important')
  await user.click(button)

  // verifies that the mock function has been called exactly once
  expect(mockHandler.mock.calls).toHaveLength(1)
})
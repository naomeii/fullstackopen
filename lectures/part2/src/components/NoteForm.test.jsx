import { render, screen } from '@testing-library/react'
import NoteForm from './NoteForm'
import userEvent from '@testing-library/user-event'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const createNote = vi.fn()
  const user = userEvent.setup()

  render(<NoteForm createNote={createNote} />)

  // const input = screen.getByRole('textbox') // accesses input field
  // const inputs = screen.getAllByRole('textbox') // used for multiple input fields
  const input = screen.getByPlaceholderText('write note content here') // best method so order doesn't matter
  const sendButton = screen.getByText('save')

  // await user.type(input, 'testing a form...')
  // await user.type(inputs[0], 'testing a form...')
  await userEvent.type(input, 'testing a form...')
  await user.click(sendButton)

  // console.log(createNote.mock.calls)
  // [ [ { content: 'testing a form...', important: true } ] ]


  // ensures that submitting the form calls the createNote method
  expect(createNote.mock.calls).toHaveLength(1)
  // checks that the evt handler is called with the right parameters aka
  // a note with the correct content is created when a form is filled
  // the content in this case is "testing a form..."
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})
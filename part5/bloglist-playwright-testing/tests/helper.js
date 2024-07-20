const loginWith = async (page, username, password)  => {
    await page.locator('input[name="Username"]').fill(username)
    await page.locator('input[name="Password"]').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  // need multiple
  await page.getByTestId('title').fill(title);
  await page.getByTestId('author').fill(author);
  await page.getByTestId('url').fill(url);
  await page.getByRole('button', { name: 'create' }).click();

  await page.getByText(`${title}`).waitFor()

  // since browser is re-rendered when the server responds based on the state of the notes at the start of the insert operation
}

        // // BEST solution incase BlogForm was changed is to:
        // // define unique test ids for the fields and use getByTestId
        // await page.getByTestId('username').fill('mluukkai')
        // await page.getByTestId('password').fill('salainen')

export { loginWith, createBlog }
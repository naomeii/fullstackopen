const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset') // goes to the route that empties database
    await request.post('/api/users', { // creates a user in database
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    // await page.goto('http://localhost:5173') // starts the page
    await page.goto('') // since we defined a baseUrl in playwright config

})

  test('Login form is shown', async ({ page }) => {
    
    const locator = await page.getByText('log in to application :D')
    await expect(locator).toBeVisible()

    // expect fields and button    
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.locator('input[name="Username"]')).toBeVisible()

    await expect(page.getByText('password')).toBeVisible()
    await expect(page.locator('input[name="Password"]')).toBeVisible()

    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        await loginWith(page, 'mluukkai', 'salainen')
        await expect(page.getByText('Matti Luukkainen is logged in')).toBeVisible()

    })

    test('fails with wrong credentials', async ({ page }) => {
        await loginWith(page, 'mluukkai', 'wrong')
        await expect(page.getByText('Matti Luukkainen is logged in')).not.toBeVisible()

    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen')
            // await request.post('/api/users', { // creates another user in database
            //     data: {
            //       name: 'Another user',
            //       username: 'anotheruser',
            //       password: 'salainen'
            //     }
            //   })
        })
      
        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, 'this blog was fixed during testing', 'randomName', 'randomUrl.com')

            await expect(page.getByText('this blog was fixed during testing')).toBeVisible()        
            await expect(page.getByRole('button', { name: 'view' })).toBeVisible()
            await expect(page.getByRole('button', { name: 'create new blog' })).toBeVisible()
        })

        test('5.20 a blog can be liked', async ({ page }) => {
            // creating again cuz all tests run separately
            await createBlog(page, 'this blog was fixed during testing', 'randomName', 'randomUrl.com')

            const blog = page.locator('.allBlogs').filter({ hasText: 'this blog was fixed during testing' })
            await blog.getByRole('button', { name: 'view' }).click()
            await blog.getByRole('button', { name: 'like' }).click();
        })

        
        // test('5.21 user who added blog can delete the blog', async ({ page }) => {
        //     await createBlog(page, 'blog for deletion', 'me', 'google.com')

        //     const blog = page.locator('.allBlogs').filter({ hasText: 'blog for deletion' })
        //     await blog.getByRole('button', { name: 'view' }).click()
        //     await expect(blog.getByRole('button', { name: 'remove' })).toBeVisible()

        //     page.once('dialog', dialog => {
        //       console.log(`Dialog message: ${dialog.message()}`);
        //       dialog.dismiss().catch(() => {});
        //     });

        //     await page.getByRole('button', { name: 'remove' }).click();
        //     await expect(page.getByText('blog for deletion was removed')).toBeVisible();
        //     await expect(page.getByText('blog for deletion')).not.toBeVisible()        

            
        //     // await page.locator('div').filter({ hasText: /^this blog was fixed during testing randomName view$/ }).getByRole('button').click();
        //     // page.once('dialog', dialog => {
        //     //   console.log(`Dialog message: ${dialog.message()}`);
        //     //   dialog.dismiss().catch(() => {});
        //     // });
        //     // await page.getByRole('button', { name: 'remove' }).click();

        //     // await expect(page.getByText('this blog was fixed during testing')).not.toBeVisible()        

        // })

      })

    })

})
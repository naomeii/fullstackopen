const { test, describe, expect, beforeEach } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')

describe('Note app', () => {

    // each test performs this action before anything else:
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset') // empties database
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
      

    test('front page can be opened', async ({ page }) => {

    const locator = await page.getByText('Notes') // corresponds to the element where the text 'Notes' is found
    await expect(locator).toBeVisible()
    // done without using the auxiliary variable
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2024')).toBeVisible()
    })

    test('login form can be opened', async ({ page }) => {

        // getByRole retrieves the button based on its text
        // returns the Locator of the Button element
        // .click() Locator method is used to press the buton
        await page.getByRole('button', { name: 'log in' }).click()

        // when the form is opened, look for text fields and enter user & pw
        // await page.getByRole('textbox').fill('mluukkai') is only for 1 textbox

        // solution for 2 textboxes:
        // await page.getByRole('textbox').first().fill('mluukkai')
        // await page.getByRole('textbox').last().fill('salainen')

        // solution for MULTIPLE textboxes:
        // const textboxes = await page.getByRole('textbox').all()
        // await textboxes[0].fill('mluukkai')
        // await textboxes[1].fill('salainen')

        // BEST solution incase LoginForm was changed is to:
        // define unique test ids for the fields and use getByTestId
        await page.getByTestId('username').fill('mluukkai')
        await page.getByTestId('password').fill('salainen')
      
        
        await page.getByRole('button', { name: 'login' }).click()
      
        await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()

      })

      test('login fails with wrong password', async ({ page }) => {
        await page.getByRole('button', { name: 'log in' }).click()
        await page.getByTestId('username').fill('mluukkai')
        await page.getByTestId('password').fill('wrong')
        await page.getByRole('button', { name: 'login' }).click()
    
        // await expect(page.getByText('wrong credentials')).toBeVisible()
        // more refined approach since the error contains className 'error'
        const errorDiv = await page.locator('.error')
        await expect(errorDiv).toContainText('wrong credentials')
        // and that the error message looks correct
        await expect(errorDiv).toHaveCSS('border-style', 'solid')
        await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

        // the test better not log the user in
        await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()

      })

      // testing Note creation
      describe('when logged in', () => {
        // We need to log in AGAIN, b/c we specified Playwright to NOT execute tests in parallel
        // logs in before each test
        beforeEach(async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen')
        })
    
        test('a new note can be created', async ({ page }) => {
          await createNote(page, 'a note created by playwright', true)
          await expect(page.getByText('a note created by playwright')).toBeVisible()
        })

        describe('and a note exists', () => {
            beforeEach(async ({ page }) => {
                await createNote(page, 'first note', true)
                await createNote(page, 'second note', true)
                await createNote(page, 'third note', true)  
            })

            test('importance can be changed', async ({ page }) => {
                await page.pause()
                const otherNoteText = await page.getByText('second note')
                const otherNoteElement = await otherNoteText.locator('..')
              
                await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
                await expect(otherNoteElement.getByText('make important')).toBeVisible()
              })
        })

        // describe('and several notes exists', () => {
        //     beforeEach(async ({ page }) => {
        //       await createNote(page, 'first note', true)
        //       await createNote(page, 'second note', true)
        //       await createNote(page, 'third note', true)
        //     })
            
        //     // we change importance of second created note
        //     test('one of those can be made nonimportant', async ({ page }) => {
        //         await page.pause() // during debugging, breakpoint here

        //         const otherNoteText = await page.getByText('second note')
        //         const otherdNoteElement = await otherNoteText.locator('..')
              
        //         await otherdNoteElement.getByRole('button', { name: 'make not important' }).click()
        //         await expect(otherdNoteElement.getByText('make important')).toBeVisible()
        //     })
        
            // test('one of those can be made nonimportant', async ({ page }) => {
            // //   const otherNoteElement = await page.getByText('first note')
            // //   await otherNoteElement
            // //     .getByRole('button', { name: 'make not important' }).click()
            // //   await expect(otherNoteElement.getByText('make important')).toBeVisible()
                
            // // can also be written without the auxiliary variable
            // //   await page.getByText('first note')
            // //   .getByRole('button', { name: 'make not important' }).click()
          
            // //   await expect(page.getByText('first note').getByText('make important'))
            // //   .toBeVisible()

            // // // when <span> elements, use:
            // // const otherNoteText = await page.getByText('first note') // looks for the span elem containing the first created note
            // // const otherNoteElement = await otherNoteText.locator('..') // retrieves the elem's parent element

            // // await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
            // // await expect(otherNoteElement.getByText('make important')).toBeVisible()
            // // // because await page.getByText('second note') returns a span elem containing ONLY text. button is outside of it now
            

            // // another method: using only 1 auxiliary variable
            // const secondNoteElement = await page.getByText('second note').locator('..')
            // await secondNoteElement.getByRole('button', { name: 'make not important' }).click()
            // await expect(secondNoteElement.getByText('make important')).toBeVisible()
            // })
        // })

      })  

})
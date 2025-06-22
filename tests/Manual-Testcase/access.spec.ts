import { test, expect } from "@playwright/test"
import { Login } from "../utils";

test.beforeEach(async ({page})=>{
    await Login(page);
    await expect(page.locator('h6')).toHaveText('Dashboard');
    await page.click('a[href="/web/index.php/pim/viewPimModule"]');
    await page.getByRole('button', {name : 'Add'}).click();
    await expect(page.getByRole('heading', {name:'Add Employee'})).toBeVisible();
    const errormsg = page.locator('div:has(input[name="firstName"]) span.oxd-input-field-error-message');
})

// add employee success without account
test('Add employee without account', async ({page}) => {
    
})
import {test, expect} from '@playwright/test'
import { getErrorLocator, getLongtext } from '../utils';
import { Login } from '../utils';
import path from 'path';


test.beforeEach(async ({page})=>{
    await Login(page);
    await expect(page.locator('h6')).toHaveText('Dashboard');
    await page.click('a[href="/web/index.php/pim/viewPimModule"]');
    await page.getByRole('button', {name : 'Add'}).click();
    await expect(page.getByRole('heading', {name:'Add Employee'})).toBeVisible();
    const errormsg = page.locator('div:has(input[name="firstName"]) span.oxd-input-field-error-message');
})

// firstname 1 character
test('Add with firstname 1 character', async ({page})=> {
    await page.fill('input[name="firstName"]', 'N');
    await page.click('button[type="submit"]');

    const errormsg = page.locator('div:has(input[name="firstName"]) span.oxd-input-field-error-message');
    await expect(errormsg).not.toBeVisible();   
})
// firstName 0 character
test('Add with firstName 0 character', async ({page})=>{
    await page.click('button[type="submit"]');
    const errormsg = page.locator('div:has(input[name="firstName"]) span.oxd-input-field-error-message').first();
    await expect(errormsg).toBeVisible();
    await expect(errormsg).toHaveText('Required');
})
//firstName 255 character
test('firstName 255 character', async ({page}) => {
    const longName = getLongtext(255);
    await page.getByRole('textbox', {name: 'First Name'}).fill(longName);
    await page.getByRole('button', {name: 'Save'}).click();

    await expect(getErrorLocator(page, 'firstName')).toBeVisible();
})
// firstName with " " character
test('Add with firstName have space character', async ({page}) => {
    await page.getByRole('textbox', {name: 'First Name'}).fill(' ');
    await page.getByRole('button', {name: 'Save'}).click();

    await expect(getErrorLocator(page, 'firstName')).toBeVisible();
})

// Middle 255 character
test('Add with middleName 255 characters', async ({page}) =>{
    const longName = getLongtext(255);
    await page.getByRole('textbox', {name: 'Middle Name'}).fill(longName);

    await expect(getErrorLocator(page, 'middleName')).toBeVisible();
    await expect(getErrorLocator(page, 'middleName')).toHaveText('Should not exceed 30 characters');
})
// Middle 0 character
test('Add with middleName 0 character', async ({page}) => {
    await page.getByRole('button', {name: 'Save'}).click();
    await expect(getErrorLocator(page, 'middleName')).not.toBeVisible();
})

//lastName 0 character
test('Add with lastName 0 character', async ({page}) => {
    await page.getByRole('button', {name: 'Save'}).click();
    await expect(getErrorLocator(page, 'lastName')).toBeVisible();
    await expect(getErrorLocator(page, 'lastName')).toHaveText('Required');

})
// lastName 1 character
test('Add with lastName 1 character', async ({page}) => {
    await page.getByRole('textbox', {name: 'Last Name'}).fill('T');
    await page.getByRole('button', {name: 'Save'}).click();
    await expect(getErrorLocator(page, 'lastName')).not.toBeVisible();
})
// lastName 255 character
test('Add with lastName 255 character', async ({page}) => {
    await page.getByRole('textbox', {name: 'Last Name'}).fill(getLongtext(255));
    await page.getByRole('button', {name: 'Save'}).click();

    await expect(getErrorLocator(page, 'lastName')).toBeVisible();
    await expect(getErrorLocator(page, 'lastName')).toHaveText('Should not exceed 30 characters');
})
// lastName with space character
test('Add with lastName space character', async ({page}) => {
    await page.getByRole('textbox', {name: 'Last Name'}).fill(' ');
    await page.getByRole('button', {name: 'Save'}).click();

    await expect(getErrorLocator(page, 'lastName')).toBeVisible();
    await expect(getErrorLocator(page, 'lastName')).toHaveText('Required');
})

//image 1 mb
test('Add with image 1MB', async ({page}) => {
    await page.click('button.employee-image-action');
    // Đường dẫn tuyệt đối tới file ảnh trong thư mục assets
    const filepath = path.resolve(__dirname, '../assets/file_example_PNG_1MB.png')
    // Tìm input file và upload ảnh
    await page.setInputFiles('input[type="file"]', filepath);
    await page.getByRole('button', {name: 'Save'}).click();
    const error = page.locator('span.oxd-input-field-error-message');

    await expect(error).not.toBeVisible();
})
// image 2 mb
test('Add with image 2MB', async ({page})=>{
    await page.locator('form').getByRole('img', {name: 'profile picture'}).click();
    const filepath = path.resolve(__dirname, '../assets/file_example_PNG_2100kB.png');
    await page.setInputFiles('input[type="file"]', filepath);

    const error = page.locator('span.oxd-input-field-error-message');
    await expect(error).toBeVisible();
    await expect(error).toHaveText('Attachment Size Exceeded');
})
//error format image - pdf
test('Add error format image - pdf', async ({page})=>{
    await page.locator('form').getByRole('img', {name: 'profile picture'}).click();
    const filepath = path.resolve(__dirname, '../assets/report_teamplate.pdf');
    await page.setInputFiles('input[type="file"]', filepath);

    const error = page.locator('span.oxd-input-field-error-message');
    await expect(error).toBeVisible();
    await expect(error).toHaveText('File type not allowed');
    
})

// employeeId existed
test('Add with employeeId existed', async ({page})=>{
    await page.getByRole('textbox').nth(4).fill('0001');
    await page.getByRole('button', {name: 'Save'}).click();

    const error = page.getByText('Employee Id already exists')
    await expect(error).toBeVisible();
})
//employeeId not existed and 11 character
test('Add with employeeId not existed and 11 character', async ({page})=>{
    await page.getByRole('textbox').nth(4).fill('00000222223');
    await page.getByRole('button', {name: 'Save'}).click();

    const error =  page.getByText("Should not exceed 10 characters");
    await expect(error).toBeVisible();
})
//employeeId not existed and 10 character
test('Add with employeeId not existed and 10 character', async ({page})=>{
    await page.getByRole('textbox').nth(4).fill('0000000033');
    await page.getByRole('button', {name: 'Save'}).click();

    const error =  page.getByText("Should not exceed 10 characters");
    await expect(error).not.toBeVisible();
})

//username existed
test('Add with username existed ', async ({page})=>{
    await page.locator('span.oxd-switch-input').click(); // bật toggle
    const usernameInput = page.locator('div.oxd-input-group input.oxd-input').nth(4); // kiểm tra đúng index
    await expect(usernameInput).toBeVisible();
    await usernameInput.fill('nguyenngoctieuthu');
    await page.waitForTimeout(5000);
    const error = page.getByText('Username already exists');
    await expect(error).toBeVisible();
})
//username not existed and 4 characters
test('Add with username not existed and 4 characters', async ({page})=>{
    await page.locator('span.oxd-switch-input').click(); // bật toggle
    const usernameInput = page.locator('div.oxd-input-group input.oxd-input').nth(4); // kiểm tra đúng index
    await expect(usernameInput).toBeVisible();
    await usernameInput.fill('thuu');
    
    const error = page.getByText('Should be at least 5 characters');
    await expect(error).toBeVisible();
})
//username not existed and 5 characters
test('Add with username not existed and 5 characters', async ({page})=>{
    await page.locator('span.oxd-switch-input').click(); // bật toggle
    const usernameInput = page.locator('.oxd-input-group:has(label:has-text("Username")) input.oxd-input'); // kiểm tra đúng index
    await expect(usernameInput).toBeVisible();
    await usernameInput.fill('nguye');
    
    const error = page.getByText('Should be at least 5 characters');
    await expect(error).not.toBeVisible();
})
//username not existed and 255 characters
test('Add with username not existed and 255 characters', async ({page})=>{
    await page.locator('span.oxd-switch-input').click(); // bật toggle
    const usernameInput = page.locator('.oxd-input-group:has(label:has-text("Username")) input.oxd-input'); // kiểm tra đúng index
    await expect(usernameInput).toBeVisible();
    await usernameInput.fill(getLongtext(255));
    
    const error = page.getByText('Should not exceed 40 characters');
    await expect(error).toBeVisible();
})

//password valid with 8 characters
test('Add with password valid and 8 characters', async ({page})=>{
    await page.locator('span.oxd-switch-input').click(); // bật toggle
    const pass = page.locator('input[type="password"]').first(); 
    await pass.fill('Test@123');
    
    const error = page.getByText('Should have at least 8 characters');
    await expect(error).not.toBeVisible();
})
//password invalid with 7 characters
test('Add with password valid and 7 characters', async ({page})=>{
    await page.locator('span.oxd-switch-input').click(); // bật toggle
    const pass = page.locator('div:has(label:has-text("Password")) input[type="password"]').first(); 
    await pass.fill('Test@12');
    
    const error = page.getByText('Should have at least 8 characters');
    await expect(error).toBeVisible(); 
})
//password not has an upercase
test('Add with password not has an upercase', async ({page})=>{
    await page.locator('span.oxd-switch-input').click(); // bật toggle
    const pass = page.locator('div:has(label:has-text("Password")) input[type="password"]').first(); 
    await pass.fill('test@123');
    
    const error = page.getByText('Your password must contain minimum 1 upper-case letter');
    await expect(error).toBeVisible(); 
})
//password not has a lower-case
test('Add with password not has an lower-case', async ({page})=>{
    await page.locator('span.oxd-switch-input').click(); // bật toggle
    const pass = page.locator('div:has(label:has-text("Password")) input[type="password"]').first();; 
    await pass.fill('TEST@123');
    
    const error = page.getByText('Your password must contain minimum 1 lower-case letter');
    await expect(error).toBeVisible(); 
})
//password not has a special character
test('Add with password not has a special character', async ({page})=>{
    await page.locator('span.oxd-switch-input').click(); // bật toggle
    const pass = page.locator('div:has(label:has-text("Password")) input[type="password"]').first(); 
    await pass.fill('Test0123');
    
    const error = page.getByText('Your password must contain minimum 1 special character');
    await expect(error).toBeVisible(); 
})


//Confirm Password match Password
test('Add with Confirm Password match Password', async ({page})=>{
    await page.locator('span.oxd-switch-input').click(); // bật toggle
    const pass = page.locator('div:has(label:has-text("Password")) input[type="password"]'); 
    await pass.first().fill('Tieuthu123@##');
    await pass.last().fill('Tieuthu123@##');
    
    const error = page.getByText('Passwords do not match');
    await expect(error).not.toBeVisible(); 
})
//Confirm Password not match Password
test('Add with Confirm Password not match Password', async ({page})=>{
    await page.locator('span.oxd-switch-input').click(); // bật toggle
    const pass = page.locator('div:has(label:has-text("Confirm Password")) input[type="password"]'); 
    await pass.first().fill('Tieuthu123@##');
    await pass.last().fill('Tthu123@')
    await page.waitForTimeout(1500);
    const error = page.getByText('Passwords do not match');
    await expect(error).toBeVisible(); 
})
import { Page, Locator } from "@playwright/test";

export function getLongtext(lenth: number):string{
    return 'a'.repeat(lenth);
}
export function getErrorLocator(page : Page, fieldName : string){
    return page.locator(`div:has(input[name="${fieldName}"]) span.oxd-input-field-error-message`).first();
} 

export async function Login(page:Page) {
    await page.goto('http://localhost:8080/web/index.php/auth/login');
    await page.getByRole('textbox', {name: 'Username'}).fill('nguyenngoctieuthu');
    await page.getByRole('textbox', {name: 'Password'}).fill('Phuong1993@');
    await page.getByRole('button', {name: 'Login'}).click();
}


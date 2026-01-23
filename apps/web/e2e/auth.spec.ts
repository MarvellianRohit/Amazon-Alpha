import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
    test('should redirect to login when accessing protected route', async ({ page }) => {
        await page.goto('/account');
        await expect(page).toHaveURL(/\/auth\/login/);
    });

    test('should allow user to login', async ({ page }) => {
        await page.goto('/auth/login');

        // Fill in credentials (using the demo/mock flow)
        await page.fill('input[type="email"]', 'demo@example.com');
        await page.fill('input[type="password"]', 'password');
        await page.click('button:has-text("Sign In")');

        // Should redirect to account page
        await expect(page).toHaveURL(/\/account/);
        await expect(page.locator('h1')).toContainText('Account');
    });
});

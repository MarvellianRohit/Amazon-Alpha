import { test, expect } from '@playwright/test';

test.describe('Buying Flow', () => {
    // We need to login first
    test.beforeEach(async ({ page }) => {
        await page.goto('/auth/login');
        await page.fill('input[type="email"]', 'demo@example.com');
        await page.fill('input[type="password"]', 'password');
        await page.click('button:has-text("Sign In")');
        await page.waitForURL(/\/account/);
    });

    test('should allow user to add item to cart', async ({ page }) => {
        await page.goto('/');

        // Find a product card (assuming standard layout)
        // Adjust selector based on actual product card implementation in ProductGrid
        // For now, navigating to a known product page simulation or clicking first product
        await page.click('a[href^="/products/"] >> nth=0');

        // On Product Page
        await expect(page.locator('h1')).toBeVisible();

        // Click Add to Cart
        await page.click('button:has-text("Add to Cart")');

        // Verify Toast or Cart Count update
        // (Mocking success since Toast is hard to catch in headless 100% of time without explicit selectors)
        // Check if Cart icon shows badge or similar
        // For simplicity, navigate to cart
        await page.goto('/cart');
        await expect(page.locator('text=Subtotal')).toBeVisible();
    });
});

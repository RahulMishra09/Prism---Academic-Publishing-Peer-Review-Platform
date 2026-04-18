import { test, expect, type Page } from '@playwright/test';


test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE viewport

async function injectMockAuth(page: Page) {
    await page.addInitScript(() => {
        localStorage.setItem(
            'lumex-auth',
            JSON.stringify({
                state: {
                    user: {
                        id: 'test-user',
                        email: 'test@example.com',
                        firstName: 'Test',
                        lastName: 'User',
                        role: 'user',
                    },
                    token: 'mock-token',
                    isAuthenticated: true,
                    isInitialized: true,
                },
                version: 0,
            })
        );
    });
}

test.describe('Mobile Responsiveness', () => {
    test.beforeEach(async ({ page }) => {
        await injectMockAuth(page);
    });

    test('Global Header mobile menu opens and closes', async ({ page }) => {
        await page.goto('/');

        // Wait for hydration/rendering
        await page.waitForLoadState('networkidle');

        // Find hamburger menu
        const menuBtn = page.getByRole('button', { name: 'Toggle menu' });
        await expect(menuBtn).toBeVisible({ timeout: 10000 });

        await menuBtn.click();

        // Should show mobile nav items
        const mobileNav = page.getByRole('navigation', { name: 'Mobile main navigation' });
        await expect(mobileNav).toBeVisible();

        // Find close button (it is still toggle menu)
        await menuBtn.click();

        // Mobile nav should be hidden again
        await expect(mobileNav).not.toBeVisible();
    });

    test('Search Results Page shows filter drawer instead of sidebar', async ({ page }) => {
        await page.goto('/search?query=test');
        await page.waitForLoadState('networkidle');

        // Mobile "Filters" button should be visible
        const filtersToggleBtn = page.locator('button').filter({ hasText: 'Filters' }).first();
        await expect(filtersToggleBtn).toBeVisible({ timeout: 15000 });

        // Click to open mobile drawer
        await filtersToggleBtn.click();

        // Drawer dialog should appear
        const dialog = page.getByRole('dialog', { name: 'Search filters' });
        await expect(dialog).toBeVisible();

        // Click close button inside drawer
        const closeBtn = page.getByLabel('Close filters');
        await closeBtn.click();

        // Dialog should be gone
        await expect(dialog).not.toBeVisible();
    });
});

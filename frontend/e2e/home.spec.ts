import { test, expect } from '@playwright/test';

/**
 * homepage.spec.ts
 * ----------------
 * Smoke tests for the Lumex frontend. The app uses auth-guarded routes, so
 * most meaningful flows require authentication. The two stable tests below
 * verify that the page loads and the login page is fully rendered.
 *
 * Future: wire up the Zustand auth-store persistence key to addInitScript
 * to unlock authenticated-page tests without needing a live API.
 */

test('app loads with correct title', async ({ page }) => {
    await page.goto('/');

    // index.html title was updated from "frontend" to "Lumex | Scientific Research Platform"
    await expect(page).toHaveTitle(/Lumex/);
    await expect(page.locator('body')).toBeVisible();
});

test('login page renders the sign-in form correctly', async ({ page }) => {
    await page.goto('/login');

    // Title check
    await expect(page).toHaveTitle(/Lumex/);

    // At least one heading should be visible on the login page
    const loginHeading = page.getByRole('heading').first();
    await expect(loginHeading).toBeVisible({ timeout: 10000 });

    // The email input field should be present
    const emailInput = page.getByRole('textbox').first();
    await expect(emailInput).toBeVisible({ timeout: 10000 });
});

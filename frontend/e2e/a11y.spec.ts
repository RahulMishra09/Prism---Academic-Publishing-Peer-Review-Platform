import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * a11y.spec.ts
 * ─────────────
 * Automated WCAG accessibility scan using axe-core.
 * We check for zero critical/serious violations on the login page
 * and any other publicly accessible pages that don't require auth.
 */

test('login page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/login');

    const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        // Exclude known third-party embedded content
        .exclude('[data-testid="third-party-iframe"]')
        .analyze();

    // Filter to only critical and serious violations
    const criticalViolations = accessibilityScanResults.violations.filter(
        v => v.impact === 'critical' || v.impact === 'serious'
    );

    if (criticalViolations.length > 0) {
        const summary = criticalViolations
            .map(v => `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} nodes)`)
            .join('\n');
        console.error(`Accessibility violations:\n${  summary}`);
    }

    expect(criticalViolations).toHaveLength(0);
});

test('journals list page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/journals');

    // Wait for content to load
    await page.waitForLoadState('networkidle');

    const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

    const criticalViolations = accessibilityScanResults.violations.filter(
        v => v.impact === 'critical' || v.impact === 'serious'
    );

    if (criticalViolations.length > 0) {
        console.error(
            `Violations:\n${ 
            criticalViolations.map(v => `[${v.impact}] ${v.id}: ${v.description}`).join('\n')}`
        );
    }

    expect(criticalViolations).toHaveLength(0);
});

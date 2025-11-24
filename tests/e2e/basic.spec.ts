import { test, expect } from '@playwright/test';

test('landing renders', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Zip Viewer')).toBeVisible();
  await expect(page.getByText(/ZIP/)).toBeVisible();
});

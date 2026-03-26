import { test, expect } from "@playwright/test";

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
  });

  test("should show error on invalid credentials", async ({ page }) => {
    await page.fill('input[placeholder="user"]', "wrong");
    await page.fill('input[placeholder="password"]', "wrongpassword");
    await page.click('button:has-text("Sign In")');

    const error = page.locator("text=Invalid username or password");
    await expect(error).toBeVisible();
  });

  test("should login, show Kanban board, and logout", async ({ page }) => {
    await page.fill('input[placeholder="user"]', "user");
    await page.fill('input[placeholder="password"]', "password");
    await page.click('button:has-text("Sign In")');

    // Title of the Kanban board
    await expect(page.locator("h1:has-text('Kanban Studio')")).toBeVisible();

    // Logout
    await page.click('button:has-text("Logout")');

    // Should be back on login
    await expect(page.locator("h1:has-text('Kanban Login')")).toBeVisible();
  });
});

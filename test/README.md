# Blottolog E2E Tests

Playwright end-to-end tests for the Blottolog PWA drink tracking app.

## Test Coverage

### Main Test Suite: `blottolog.spec.js`

#### Test 1: "Add a single drink to a blank session and persist it"
- ✅ Clears localStorage before test to ensure blank session
- ✅ Verifies add button (➕) is visible
- ✅ Opens drink selection dialog
- ✅ Selects Beer drink type
- ✅ Verifies size buttons update with beer icon (🍺)
- ✅ Selects Regular size
- ✅ Verifies drink appears in drinks list with icon and label
- ✅ Verifies add button remains visible
- ✅ Refreshes page
- ✅ Verifies drink persisted in localStorage and still visible
- ✅ Verifies drink list and add button still visible after refresh

#### Test 2: "Handle different drink types and sizes correctly"
- ✅ Tests Wine (🍷) + Small combination
- ✅ Verifies correct icons and labels display
- ✅ Tests icon updates when drink type changes

#### Test 3: "Maintain UI state after user cancels drink selection"
- ✅ Tests dialog cancellation flow
- ✅ Verifies add button remains functional after cancel

## Setup

### Prerequisites
- Node.js 16+ installed
- Project dependencies installed: `npm install`

### Installation

From the `test` directory:
```bash
npm install
```

(Playwright and dependencies are already listed in package.json)

## Running Tests

### Run all tests
```bash
npm test
```

### Run with UI mode (recommended for development)
```bash
npm run test:ui
```

### Run in debug mode
```bash
npm run test:debug
```

### Run specific browser only
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Run with specific test file
```bash
npx playwright test tests/blottolog.spec.js
```

### Run single test
```bash
npx playwright test -g "should add a single drink"
```

## Configuration

### Playwright Config (`playwright.config.js`)
- **Test Directory**: `./tests`
- **Base URL**: `http://localhost:8000`
- **Web Server**: Automatically starts http-server serving `../public` on port 8000
- **Browsers**: Chromium, Firefox, WebKit
- **Trace**: Recorded on first retry for debugging

### Test Database
Each test clears localStorage before running to ensure a fresh session. No test data persists between test runs.

## Debugging

### View test report
After running tests, view the HTML report:
```bash
npx playwright show-report
```

### Run with trace viewer
```bash
npx playwright show-trace trace.zip
```

### Enable logging
```bash
DEBUG=pw:api npm test
```

## Writing New Tests

Add new test files to the `tests/` directory with `.spec.js` extension.

Example test structure:
```javascript
import { test, expect } from '@playwright/test';

test('description', async ({ page }) => {
  // Clear localStorage for fresh session
  await page.goto('/app/blottolog/index.html');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  
  // Test steps...
  const element = page.locator('#element-id');
  await expect(element).toBeVisible();
  // ... more assertions
});
```

## Troubleshooting

### Tests fail with "connection refused"
- Make sure the http-server can start from the project root
- Check that port 8000 is available
- Manually start server: `cd ../public && npx http-server -p 8000`

### Elements not found
- Increase timeout: `await page.waitForSelector('#id', { timeout: 10000 })`
- Check element IDs match HTML structure
- Use `page.screenshot()` to debug

### LocalStorage not clearing
- Verify `localStorage.clear()` is called in `beforeEach`
- Check for service worker cache issues

## Service Worker & PWA Considerations

Blottolog is a PWA with service worker caching. The test config handles this by:
- Setting `reuseExistingServer` to false in CI to avoid cache conflicts
- Clearing localStorage before each test
- Reloading the page after clearing storage

For manual testing with cache issues, clear browser data or use incognito mode.

## CI/CD Integration

Tests are configured for CI environments via the `CI` environment variable:
```bash
CI=true npm test
```

This will:
- Use single worker (no parallelization)
- Retry failed tests up to 2 times
- Generate HTML report with traces

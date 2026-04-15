# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: blottolog.spec.js >> Blottolog PWA - Add Drink Functionality >> should add a single drink to a blank session and persist it
- Location: tests\blottolog.spec.js:139:3

# Error details

```
TimeoutError: page.waitForSelector: Timeout 5000ms exceeded.
Call log:
  - waiting for locator('#add_btn') to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - button "Profile" [ref=e3] [cursor=pointer]: 🫅
    - generic [ref=e4]:
      - img [ref=e5]:
        - generic [ref=e9]: B l o t t o l o g
      - generic [ref=e10]: 💀
      - generic [ref=e11]: 🍹
      - generic [ref=e12]: 💰
    - button "Target" [ref=e13] [cursor=pointer]: 🤢
  - generic [ref=e14]:
    - img [ref=e16]
    - heading "Drinks in Progress" [level=1] [ref=e18]
    - listitem [ref=e20] [cursor=pointer]:
      - generic [ref=e21]: 🍺
      - generic [ref=e22]: Beer Regular
    - img [ref=e24]
    - heading "Finished Drinks" [level=1] [ref=e26]
    - list [ref=e28]: 🙊
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | function clearBrowserLocalStorage()
  4   | {
  5   |   localStorage.clear();
  6   | }
  7   | 
  8   | async function clearLocalStorage(page)
  9   | {
  10  |   await page.evaluate(clearBrowserLocalStorage);
  11  | }
  12  | 
  13  | async function loadBlottologBlankSession(page)
  14  | {
  15  |   await page.goto('/app/blottolog/index.html');
  16  |   await clearLocalStorage(page);
  17  |   await page.reload();
  18  |   await page.waitForSelector('#add_btn', { timeout: 5000 });
  19  | }
  20  | 
  21  | async function beforeEachHandler({ page })
  22  | {
  23  |   await loadBlottologBlankSession(page);
  24  | }
  25  | 
  26  | async function verifyAddButtonVisible(page)
  27  | {
  28  |   const addButton = page.locator('#add_btn');
  29  |   await expect(addButton).toBeVisible();
  30  |   await expect(addButton).toContainText('➕');
  31  |   return addButton;
  32  | }
  33  | 
  34  | async function selectDrinkType(page, selector, expectedIcon)
  35  | {
  36  |   const drinkType = page.locator(selector);
  37  |   await expect(drinkType).toBeVisible();
  38  |   await expect(drinkType).toHaveAttribute('icon', expectedIcon);
  39  |   await drinkType.click();
  40  | }
  41  | 
  42  | async function verifySizeButtonsIcon(page, expectedIcon)
  43  | {
  44  |   const smallDrink = page.locator('#small_drink');
  45  |   const regularDrink = page.locator('#regular_drink');
  46  |   const largeDrink = page.locator('#large_drink');
  47  | 
  48  |   await expect(smallDrink).toHaveAttribute('icon', expectedIcon);
  49  |   await expect(regularDrink).toHaveAttribute('icon', expectedIcon);
  50  |   await expect(largeDrink).toHaveAttribute('icon', expectedIcon);
  51  |   return { smallDrink, regularDrink, largeDrink };
  52  | }
  53  | 
  54  | async function verifyDrinkAdded(page, expectedIcon, expectedType, expectedSize)
  55  | {
  56  |   const wipDrinksList = page.locator('#wip_drinks_elem');
  57  |   await expect(wipDrinksList).toBeVisible();
  58  | 
  59  |   const drinkItems = page.locator('#wip_drinks_elem li');
  60  |   await expect(drinkItems).toHaveCount(1);
  61  | 
  62  |   const drinkIcon = page.locator('#wip_drinks_elem li .icon');
  63  |   await expect(drinkIcon).toContainText(expectedIcon);
  64  | 
  65  |   const drinkLabel = page.locator('#wip_drinks_elem li .label');
  66  |   await expect(drinkLabel).toContainText(expectedType);
  67  |   await expect(drinkLabel).toContainText(expectedSize);
  68  | }
  69  | 
  70  | async function waitForDialog(page)
  71  | {
  72  |   const selectDialog = page.locator('#select_drink_dlg');
  73  |   await expect(selectDialog).toBeVisible();
  74  |   return selectDialog;
  75  | }
  76  | 
  77  | async function closeSelectionDialog(page)
  78  | {
  79  |   const closeButton = page.locator('#select_drink_dlg [popovertargetaction="hide"]');
  80  |   await closeButton.click();
  81  | }
  82  | 
  83  | async function shouldAddSingleDrinkAndPersist({ page })
  84  | {
  85  |   const addButton = await verifyAddButtonVisible(page);
  86  |   await addButton.click();
  87  | 
  88  |   const selectDialog = await waitForDialog(page);
  89  | 
  90  |   await selectDrinkType(page, '#beer_drink', '🍺');
  91  |   const sizeButtons = await verifySizeButtonsIcon(page, '🍺');
  92  | 
  93  |   await sizeButtons.regularDrink.click();
  94  |   await expect(selectDialog).not.toBeVisible({ timeout: 2000 });
  95  | 
  96  |   await verifyDrinkAdded(page, '🍺', 'Beer', 'Regular');
  97  |   await verifyAddButtonVisible(page);
  98  | 
  99  |   await page.reload();
> 100 |   await page.waitForSelector('#add_btn', { timeout: 5000 });
      |              ^ TimeoutError: page.waitForSelector: Timeout 5000ms exceeded.
  101 | 
  102 |   await verifyDrinkAdded(page, '🍺', 'Beer', 'Regular');
  103 |   await verifyAddButtonVisible(page);
  104 | }
  105 | 
  106 | async function shouldHandleDifferentDrinkTypesAndSizesCorrectly({ page })
  107 | {
  108 |   const addButton = await verifyAddButtonVisible(page);
  109 |   await addButton.click();
  110 | 
  111 |   await waitForDialog(page);
  112 |   await selectDrinkType(page, '#wine_drink', '🍷');
  113 | 
  114 |   const sizeButtons = await verifySizeButtonsIcon(page, '🍷');
  115 |   await sizeButtons.smallDrink.click();
  116 | 
  117 |   await verifyDrinkAdded(page, '🍷', 'Wine', 'Small');
  118 | }
  119 | 
  120 | async function shouldMaintainUIStateAfterUserCancelsDrinkSelection({ page })
  121 | {
  122 |   const addButton = await verifyAddButtonVisible(page);
  123 |   await addButton.click();
  124 | 
  125 |   const selectDialog = await waitForDialog(page);
  126 |   await closeSelectionDialog(page);
  127 | 
  128 |   await expect(selectDialog).not.toBeVisible({ timeout: 1000 });
  129 |   await verifyAddButtonVisible(page);
  130 | 
  131 |   await addButton.click();
  132 |   await waitForDialog(page);
  133 | }
  134 | 
  135 | function describeBlottolog()
  136 | {
  137 |   test.beforeEach(beforeEachHandler);
  138 | 
  139 |   test('should add a single drink to a blank session and persist it', shouldAddSingleDrinkAndPersist);
  140 |   //test('should handle different drink types and sizes correctly', shouldHandleDifferentDrinkTypesAndSizesCorrectly);
  141 |   //test('should maintain UI state after user cancels drink selection', shouldMaintainUIStateAfterUserCancelsDrinkSelection);
  142 | }
  143 | 
  144 | test.describe('Blottolog PWA - Add Drink Functionality', describeBlottolog);
  145 | 
```
import { test, expect } from '@playwright/test';

function clearBrowserLocalStorage()
{
  localStorage.clear();
}

async function clearLocalStorage(page)
{
  await page.evaluate(clearBrowserLocalStorage);
}

async function loadBlottologBlankSession(page)
{
  await page.goto('/app/blottolog/index.html');
  await clearLocalStorage(page);
  await page.reload();
  await page.waitForSelector('#add_btn', { timeout: 5000 });
}

async function beforeEachHandler({ page })
{
  await loadBlottologBlankSession(page);
}

async function verifyAddButtonVisible(page)
{
  const addButton = page.locator('#add_btn');
  await expect(addButton).toBeVisible();
  await expect(addButton).toContainText('➕');
  return addButton;
}

async function selectDrinkType(page, selector, expectedIcon)
{
  const drinkType = page.locator(selector);
  await expect(drinkType).toBeVisible();
  await expect(drinkType).toHaveAttribute('icon', expectedIcon);
  await drinkType.click();
}

async function verifySizeButtonsIcon(page, expectedIcon)
{
  const smallDrink = page.locator('#small_drink');
  const regularDrink = page.locator('#regular_drink');
  const largeDrink = page.locator('#large_drink');

  await expect(smallDrink).toHaveAttribute('icon', expectedIcon);
  await expect(regularDrink).toHaveAttribute('icon', expectedIcon);
  await expect(largeDrink).toHaveAttribute('icon', expectedIcon);
  return { smallDrink, regularDrink, largeDrink };
}

async function verifyDrinkAdded(page, expectedIcon, expectedType, expectedSize)
{
  const wipDrinksList = page.locator('#wip_drinks_elem');
  await expect(wipDrinksList).toBeVisible();

  const drinkItems = page.locator('#wip_drinks_elem li');
  await expect(drinkItems).toHaveCount(1);

  const drinkIcon = page.locator('#wip_drinks_elem li .icon');
  await expect(drinkIcon).toContainText(expectedIcon);

  const drinkLabel = page.locator('#wip_drinks_elem li .label');
  await expect(drinkLabel).toContainText(expectedType);
  await expect(drinkLabel).toContainText(expectedSize);
}

async function waitForDialog(page)
{
  const selectDialog = page.locator('#select_drink_dlg');
  await expect(selectDialog).toBeVisible();
  return selectDialog;
}

async function closeSelectionDialog(page)
{
  const closeButton = page.locator('#select_drink_dlg [popovertargetaction="hide"]');
  await closeButton.click();
}

async function shouldAddSingleDrinkAndPersist({ page })
{
  const addButton = await verifyAddButtonVisible(page);
  await addButton.click();

  const selectDialog = await waitForDialog(page);

  await selectDrinkType(page, '#beer_drink', '🍺');
  const sizeButtons = await verifySizeButtonsIcon(page, '🍺');

  await sizeButtons.regularDrink.click();
  await expect(selectDialog).not.toBeVisible({ timeout: 2000 });

  await verifyDrinkAdded(page, '🍺', 'Beer', 'Regular');
  await verifyAddButtonVisible(page);

  await page.reload();
  await page.waitForSelector('#add_btn', { timeout: 5000 });

  await verifyDrinkAdded(page, '🍺', 'Beer', 'Regular');
  await verifyAddButtonVisible(page);
}

async function shouldHandleDifferentDrinkTypesAndSizesCorrectly({ page })
{
  const addButton = await verifyAddButtonVisible(page);
  await addButton.click();

  await waitForDialog(page);
  await selectDrinkType(page, '#wine_drink', '🍷');

  const sizeButtons = await verifySizeButtonsIcon(page, '🍷');
  await sizeButtons.smallDrink.click();

  await verifyDrinkAdded(page, '🍷', 'Wine', 'Small');
}

async function shouldMaintainUIStateAfterUserCancelsDrinkSelection({ page })
{
  const addButton = await verifyAddButtonVisible(page);
  await addButton.click();

  const selectDialog = await waitForDialog(page);
  await closeSelectionDialog(page);

  await expect(selectDialog).not.toBeVisible({ timeout: 1000 });
  await verifyAddButtonVisible(page);

  await addButton.click();
  await waitForDialog(page);
}

function describeBlottolog()
{
  test.beforeEach(beforeEachHandler);

  test('should add a single drink to a blank session and persist it', shouldAddSingleDrinkAndPersist);
  //test('should handle different drink types and sizes correctly', shouldHandleDifferentDrinkTypesAndSizesCorrectly);
  //test('should maintain UI state after user cancels drink selection', shouldMaintainUIStateAfterUserCancelsDrinkSelection);
}

test.describe('Blottolog PWA - Add Drink Functionality', describeBlottolog);

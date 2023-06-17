const { updateAccount, readAccount } = require("../db/account");
const { getMyName } = require("../modules/getMyName");
const { getRandomName } = require("./getRandomName");
const { getRandomImageFromFolder } = require("./getRandomUrlImage");

function containsEnglishAlphabet(str) {
  const regex = /[a-zA-Z1-9]/;
  return regex.test(str);
}

const accountSetup = async (page, accountId) => {
  const { setup } = await readAccount(accountId);

  console.log("Проверяю сетап для аккаунта: ", accountId);

  const settingsButton = await page?.waitForSelector(
    ".DropdownMenu.main-menu",
    {
      state: "attached",
    }
  );

  await settingsButton?.click();

  const settings = await page?.waitForSelector(
    ".MenuItem.compact:has-text('Settings')",
    {
      state: "attached",
    }
  );

  await settings?.click();

  const notifications = await page?.waitForSelector(
    '.ListItem:has-text("Notifications")'
  );

  await notifications?.click();

  try {
    const notificationsGroups = await page?.waitForSelector(
      '.Checkbox-main:has-text("Notifications for groups"):has-text("Enabled")',
      {
        state: "attached",
        timeout: 5000,
      }
    );

    await notificationsGroups?.click();
  } catch {}

  try {
    const notificationsChannels = await page?.waitForSelector(
      '.Checkbox-main:has-text("Notifications for channels"):has-text("Enabled")',
      {
        state: "attached",
        timeout: 5000,
      }
    );

    await notificationsChannels?.click();
  } catch {}

  try {
    const notificationsWeb = await page?.waitForSelector(
      '.Checkbox-main:has-text("Web notifications"):has-text("Enabled")',
      {
        state: "attached",
        timeout: 5000,
      }
    );

    await notificationsWeb?.click();
  } catch {}

  const buttonElements1 = await page?.$$('button[title="Go back"]');

  await buttonElements1[1].click();

  const buttonElement = await page?.waitForSelector(
    'button[title="Edit profile"]',
    {
      state: "attached",
    }
  );

  await buttonElement?.click();

  const firstName = await page?.waitForSelector(
    'input[aria-label="First name (required)"]',
    {
      state: "attached",
    }
  );

  const lastName = await page?.waitForSelector(
    'input[aria-label="Last name (optional)"]',
    {
      state: "attached",
    }
  );
  const bio = await page?.waitForSelector('textarea[aria-label="Bio"]', {
    state: "attached",
  });
  const userName = await page.waitForSelector('input[aria-label="Username"]', {
    state: "attached",
  });

  const firstNameValue = await firstName?.getProperty("value");
  const name = await firstNameValue?.jsonValue();

  if (setup && !containsEnglishAlphabet(name)) {
    console.log(`Сетап для пользователя ${name} существует`);
    const buttonElements = await page?.$$('button[title="Go back"]');

    await buttonElements[1].click();
    await buttonElements[0].click();
    return;
  }

  console.log(`Сетап для пользователя ${name} отсутсвует`);

  try {
    const image = getRandomImageFromFolder(
      "/Users/pikcelll/Documents/cold/telegram/images"
    );

    const uploadElement = await page.$("input[type=file]");
    await uploadElement.setInputFiles(image);

    await page.waitForLoadState();

    await page.waitForTimeout(5000);

    const buttonSave = await page.waitForSelector(
      'button[title="Crop image"]',
      {
        state: "attached",
        timeout: 5000,
      }
    );

    await buttonSave?.click();
  } catch {}

  await firstName?.fill(getRandomName(), { delay: 100 });
  await lastName?.fill("", { delay: 100 });
  await bio?.fill(
    "Разработал бота с ИИ для своего бизнеса, сделаю и для вашего @webgrow",
    { delay: 100 }
  );

  await page.waitForTimeout(5000);

  try {
    const buttonSave = await page.$$('button[title="Save"]', {
      state: "attached",
      timeout: 5000,
    });

    console.log(buttonSave.length);

    await buttonSave?.click();
  } catch {}

  const buttonElements = await page?.$$('button[title="Go back"]');

  await buttonElements[1].click();
  await buttonElements[0].click();

  console.log("Создал сетап для аккаунта: ", accountId);

  await updateAccount(accountId, {
    setup: true,
  });
};

module.exports = { accountSetup };

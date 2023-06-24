const getUserInfo = async (page) => {
  const userInfo = await page.waitForSelector(".chat-info-wrapper");
  await userInfo.click();

  let phone = "",
    userName = "";

  try {
    const phoneContent = await page.waitForSelector(
      '.multiline-item:has-text("Phone")',
      {
        timeout: 3000,
      }
    );
    phone = (await phoneContent?.textContent())?.replace("Phone", "");
  } catch {}

  try {
    const userNameContent = await page.waitForSelector(
      '.multiline-item:has-text("Username")',
      {
        timeout: 3000,
      }
    );
    userName = (await userNameContent?.textContent())?.replace("Username", "");
  } catch {}

  const closeButton = await page.waitForSelector(".Button.close-button");
  await closeButton.click();

  return [userName, phone];
};

module.exports = { getUserInfo };

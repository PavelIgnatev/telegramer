const { updateAccount, readAccount, insertAccount } = require("../db/account");

const destroyBrowser = async (username, page, context, browser) => {
  if (!username || !context || !browser) {
    throw new Error("Произошла ошибка, проверьте аргументы функции");
  }

  const cookies = await context.cookies();
  const userAgent = await page.evaluate(() => window.navigator.userAgent);
  const localStorageData = await page.evaluate(() => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      data[key] = value;
    }
    return data;
  });

  const existingAccount = await readAccount(username);

  if (existingAccount) {
    await updateAccount(username, {
      cookies,
      userAgent,
      localStorage: localStorageData,
    });
  } else {
    await insertAccount({
      username,
      cookies,
      userAgent,
      localStorage: localStorageData,
    });
  }

  await browser.close();
};

module.exports = { destroyBrowser };

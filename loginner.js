const { createPage } = require("./helpers/createPage");
const { destroyBrowser } = require("./helpers/destroyBrowser");
const { initialBrowser } = require("./helpers/initialBrowser");
const { getAllUsernames } = require("./db/account");
const { default: axios } = require("axios");

const main = async (username) => {
  if (!username) {
    throw new Error("Произошла ошибка, username не был передан");
  }

  const [context, browser] = await initialBrowser(false, username);
  const page = await createPage(context, username);

  try {
    await page.goto("https://web.telegram.org/a/");
    await page.pause();

  } catch (e) {
    console.log(e.message);
  }

  try {
    const result = await axios.get(
      "https://frigate-proxy.ru/ru/change_ip/af6e30706dee6cfc01e52d7b73944d60/998524"
    );

    console.log(result.data);

    await page.waitForTimeout(10000);
  } catch {
    console.log("Ошибка при смене прокси");
  }

  try {
    await destroyBrowser(username, page, context, browser);
    return;
  } catch {
    console.log('Ошибка при закрытии браузера "destroyBrowser"');
  }

  try {
    await browser.close();
  } catch {
    console.log('Ошибка при закрытии браузера "browser.close()"');
  }
};

function randomSort(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const startMainLoop = async () => {
  try {
    const usernames = await getAllUsernames();

    for (const username of randomSort(usernames)) {
      try {
        console.log("Начинаю вход в аккаунт: ", username);
        await main(username);
        console.log("Взод в аккаунт: ", username, " успешно завершен");
      } catch (error) {
        console.error(`Ошибка обработки входа в аккаунт ${username}: ${error}`);
      }
    }
  } catch (e) {
    console.log(e.message, "ошибка в цикле");
  }
  console.log('ВСЕ')
};

startMainLoop();

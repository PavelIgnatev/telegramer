const { createPage } = require("./helpers/createPage");
const { destroyBrowser } = require("./helpers/destroyBrowser");
const { initialBrowser } = require("./helpers/initialBrowser");
const {
  getAllUsernames,
  readAccounts,
  deleteAccount,
} = require("./db/account");
const { scrollBottom } = require("./utils/scrollBottom");
const { getUserInfo } = require("./modules/getUserInfo");
const { getSentMessages } = require("./db/message");

const main = async (username) => {
  if (!username) {
    throw new Error("Произошла ошибка, username не был передан");
  }

  const [context, browser] = await initialBrowser(false, username);
  const page = await createPage(context, username);

  await page.goto("https://web.telegram.org/a/");

  await scrollBottom(page, ".chat-list.custom-scroll");

  const users = await page.$$(".ListItem");

  const lastUser = users[users.length - 1];

  await lastUser.click();

  const messagesContainer = await page.waitForSelector(".messages-container");

  await messagesContainer.screenshot({ path: "screenshot.png" });

  await page.waitForSelector(".Message.message-list-item");

  const messages = await page.$$(".Message.message-list-item");
  const result = [];

  for (const element of messages) {
    const isOwnMessage = await element
      .getAttribute("class")
      .then((classes) => classes.includes(" own "));
    const textElement = await element.$(".text-content");
    const textContent = await textElement?.textContent();

    if (textContent) {
      if (isOwnMessage) {
        result.push(`Бот: ${textContent.slice(0, -5).replace("edited", "")}`);
      } else {
        result.push(
          `Пользователь: ${textContent.slice(0, -5).replace("edited", "")}`
        );
      }
    }
  }
  const [userName, phone] = await getUserInfo(page);

  console.log(userName, phone);

  // await lastUser.click({ modifiers: ["Control"] });

  await page.waitForTimeout(1000000);

  await destroyBrowser(username, page, context, browser);
};

const startMainLoop = async () => {
  while (true) {
    try {
      const usernames = await getAllUsernames();

      for (const username of usernames) {
        try {
          await main(username);
        } catch (error) {
          console.error(
            `Ошибка обработки для пользователя ${username}: ${error}`
          );
        }
      }
    } catch (e) {
      console.log(e.message, "ошибка в цикле");
    }
  }
};
// readAccounts().then((data) => {
//   const currentDate = new Date();
//   const currentDay = currentDate.getDate();
//   let i = 0;

//   data.forEach((data) => {
//     const targetDay = new Date(data.remainingTime).getDate();
//     if (targetDay !== currentDay) {
//       deleteAccount(data.username)
//     }
//   });
//   console.log(i);
// });

getAllUsernames().then((e) => e.forEach((k) => deleteAccount(k)));

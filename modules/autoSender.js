const { updateAccountRemainingTime, readAccount } = require("../db/account");
const { readMessage, deleteMessage, updateMessage } = require("../db/message");
const { generateRandomTime } = require("../utils/getRandomTime");
const { returnToChatList } = require("../utils/returnToChatList");
const { searchByUsername } = require("../utils/searchByUsername");
const { sendMessage } = require("../utils/sendMessage");
const { getUserInfo } = require("./getUserInfo");

const autoSender = async (page, accountId) => {
  let username, message;

  // Получаем данные аккаунта
  try {
    const { remainingTime } = await readAccount(accountId);
    const remainingDate = new Date(remainingTime);
    const currentDate = new Date();

    if (remainingTime) {
      if (remainingDate > currentDate) {
        console.log(
          `Время для отправки сообщения аккаунтом ${accountId} ещё не наступило`
        );
        return;
      }
    }
  } catch (e) {
    console.log(
      `ERROR: Не удалось получить данные аккаунта ${accountId}. Ошибка: ${e.message}`
    );
    return;
  }

  // Получаем рандомное сообщение для отправки
  try {
    const { username: randomUsername, message: randomMessage } =
      await readMessage();

    username = randomUsername;
    message = randomMessage;

    console.log("Найдено сообщение для отправки");
  } catch (e) {
    console.log(
      `ERROR: Не удалось получить сообщение для отправки. Ошибка: ${e.message}`
    );
    return;
  }

  // Поиск пользователя по имени
  try {
    await searchByUsername(page, username);
    console.log(`Пользователь ${username} успешно найден в поиске`);
  } catch (e) {
    await returnToChatList(page);

    console.log(
      `ERROR: Поиск пользователя ${username} не удался. Ошибка: ${e.message}`
    );

    return;
  }

  // Отправка сообщения
  try {
    try {
      const [userName] = await getUserInfo(page);

      if (String(userName) !== String(username)) {
        throw new Error("Пользователь не найден");
      }
    } catch {
      console.log("Ошибка при получении информации о пользователе");
    }

    await sendMessage(page, message);
    await updateMessage(username);
    await updateAccountRemainingTime(accountId, generateRandomTime());
    console.log(`Сообщение успешно отправлено пользователю ${username}`);
  } catch (e) {
    console.log(
      `ERROR: Отправка сообщения пользователю ${username} не удалась. Ошибка: ${e.message}`
    );
  }
};

module.exports = { autoSender };

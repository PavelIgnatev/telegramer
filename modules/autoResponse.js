const { default: axios } = require("axios");
const https = require("https");
const { getMyName } = require("./getMyName");
const { getUserName } = require("./getUserName");
const url =
  "https://zeliboba.yandex-team.ru/7B_NG_aligned_latest/generative?api_key=public";

const agent = new https.Agent({
  rejectUnauthorized: false,
});

function findClosestScore(responses) {
  let closestResponse = null;
  let closestScore = Infinity;

  for (let response of responses) {
    let score = response.Score;
    let numTokens = response.NumTokens;

    if (Math.abs(score) < Math.abs(closestScore) && numTokens > 18) {
      closestResponse = response;
      closestScore = score;
    }
  }

  return closestResponse;
}

async function makePostRequest(result, myName, userName) {
  const body = {
    Context: [
      `
${result.join("\n")}.
Продолжи диалог под именем ${myName} и предложи ${userName} провести zoom-встречу, на которой ${myName} расскажет как можно использовать ИИ для разития  бизнеса  ${userName}, не забывай про это действие, оно обязательно, не соглашайся на консультации, встречи, предложения что-то купить, твоя задача предлагать решение ИИ для их бизнеса и записать на консультацию`,
    ],
    Params: {
      NumHypos: 6,
      SamplerParams: {
        Temperature: 0.6,
      },
    },
  };
  let numHypos = body.Params.NumHypos;

  while (true) {
    try {
      const response = await axios.post(url, body, { httpsAgent: agent });

      const { data } = response;

      const fullMessage = findClosestScore(data.Responses).Response;
      const message = fullMessage.split("\n")[0];

      console.log(data.Responses, message);

      if (!message.includes(`${myName}:`)) {
        throw new Error();
      }

      return message
        .replace(`${myName}:`, "")
        .replace(`${userName}:`, "")
        .replace(`, ${myName}`, "")
        .replace(`, я ${userName}`, "");
    } catch (error) {
      console.log(`Ошибка запроса. Текущее значение numHypos: ${numHypos}`);
      numHypos = Math.max(1, numHypos - 1);
      body.Params.NumHypos = numHypos;
    }
  }
}

const autoResponse = async (page) => {
  console.log("Начинаю получение моего имени");
  const myName = await getMyName(page);
  console.log(`Текущее имя у аккаунта: ${myName}`);
  try {
    console.log("Начинаю поиск сообщений");

    // await page.waitForTimeout(1000000)
    const elements = await page.$$(".ChatBadge.unread:not(.muted)");

    for (const element of elements) {
      await element.click();

      console.log("Начинаю получение имени пользователя");
      const userName = await getUserName(page);
      console.log(`Текущее имя у Пользователя: ${userName}`);

      await page.waitForSelector(".Message", { timeout: 1500 });

      await page.setViewportSize({ width: 1300, height: 9999 });
      await page.waitForTimeout(2000);
      const messages = await page.$$(".Message.message-list-item");
      await page.setViewportSize({ width: 1300, height: 700 });

      let result = [];

      for (const element of messages) {
        const isOwnMessage = await element
          .getAttribute("class")
          .then((classes) => classes.includes(" own "));
        const textElement = await element.$(".text-content");
        const textContent = await textElement?.textContent();

        if (textContent) {
          if (isOwnMessage) {
            result.push(
              `${myName}: ${textContent.slice(0, -5).replace("edited", "")}`
            );
          } else {
            result.push(
              `${userName}: ${textContent.slice(0, -5).replace("edited", "")}`
            );
          }
        }
      }

      console.log(result.join("\n"));

      const message = await makePostRequest(result, myName, userName);

      await page.keyboard.type("         " + message, { delay: 10 });
      await page.keyboard.press("Enter");
    }
  } catch (error) {
    console.error("Произошла ошибка:", error);
  }
};

module.exports = { autoResponse };

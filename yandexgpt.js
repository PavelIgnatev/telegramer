const fs = require("fs");
const { default: axios } = require("axios");
const https = require("https");
const { insertMessage } = require("./db/message");
const url =
  "https://zeliboba.yandex-team.ru/7B_NG_aligned_latest/generative?api_key=public";
const outputFile = "output.txt"; // Укажите имя выходного файла

const arrayFile = "output.txt"; // Укажите имя файла с данными

function findClosestScore(responses) {
  let closestResponse = null;
  let closestScore = Infinity;

  for (let response of responses) {
    let score = response.Score;
    let numTokens = response.NumTokens;

    if (Math.abs(score) < Math.abs(closestScore) && numTokens > 21) {
      closestResponse = response;
      closestScore = score;
    }
  }

  return closestResponse;
}

async function makePostRequest(username, description) {
  const body = {
    Context: [
      `Привет, я хочу начать диалог с пользователем, чтобы установить контакт и заинтересовать его. Пожалуйста, предложи мне хороший первый вопрос, связанный с его деятельностью, который поможет нам начать продуктивный разговор. Имя пользователя: ${username} Описание пользователя: ${description}`,
    ],
    Params: {
      NumHypos: 6,
      SamplerParams: {
        Temperature: 0.35,
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

      return message;
    } catch (error) {
      console.log(`Ошибка запроса. Текущее значение numHypos: ${numHypos}`);
      numHypos = Math.max(1, numHypos - 1);
      body.Params.NumHypos = numHypos;
    }
  }
}

const agent = new https.Agent({
  rejectUnauthorized: false,
});

(async () => {
  try {
    const data = await fs.promises.readFile(arrayFile, "utf-8");
    const lines = data.split("\n");

    for (const line of lines) {
      const [urlProfile, username, description] = line.split(":");
      // const message = await makePostRequest(username, description);

      // await new Promise((r) => setTimeout(r, 1000));
      console.log(`${urlProfile}:${username}:${JSON.stringify(description)}`);
      try {
        await insertMessage({
          username: urlProfile.replace("t.me/", ""),
          accountData: username,
          message: JSON.parse(description),
        });
      } catch {}

      // fs.appendFileSync(
      //   outputFile,
      //   `${urlProfile}:${username}:${JSON.stringify(message)}\n`,
      //   { encoding: "utf-8" }
      // );
    }
  } catch (error) {
    console.error("Error reading or processing the data file:", error);
  }
})();

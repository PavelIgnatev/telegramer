const { searchByUsername } = require("./searchByUsername");

const sendMessage = async (page, message) => {
  const input = await page.waitForSelector("#editable-message-text", {
    state: "attached",
  });

  await input.type(("         " + message).replace(/"/g, ""), { delay: 10 });

  const buttonElement = await page.waitForSelector(
    'button[title="Send Message"]',
    {
      state: "attached",
    }
  );

  await buttonElement.click();

  await page.waitForTimeout(3000);

  try {
    await page.waitForSelector(
      `.Message:last-child .icon-message-succeeded`
    );
  } catch {
    throw new Error("Сообщение не доставлено");
  }

  await searchByUsername(page, "webgrow");
};

module.exports = { sendMessage };

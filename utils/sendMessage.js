const sendMessage = async (page, message) => {
  const input = await page.waitForSelector("#editable-message-text", {
    state: "attached",
  });

  await input.type("         " + message, { delay: 10 });

  const buttonElement = await page.waitForSelector(
    'button[title="Send Message"]',
    {
      state: "attached",
    }
  );

  await buttonElement.click();

  // тут доработка проверки отправки месседжа
};

module.exports = { sendMessage };

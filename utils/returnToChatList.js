const returnToChatList = async (page) => {
  const buttonElement = await page?.waitForSelector(
    'button[title="Return to chat list"]',
    {
      state: "attached",
    }
  );

  await buttonElement?.click();
};

module.exports = { returnToChatList };

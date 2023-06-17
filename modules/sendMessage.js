const sendMessage = async (page, name, message) => {
  await page.waitForTimeout(2000);

  const searchInput = await page.waitForSelector("#telegram-search-input", {
    state: "attached",
  });

  if (searchInput) {
    await searchInput.type("saved messages", { delay: 10 });

    await page.waitForTimeout(2000);

    await searchInput.press("Enter");
    await searchInput.press("Enter");

    await page.waitForTimeout(3000);

    await page.keyboard.type(`@${name}`);
    await page.keyboard.press("Enter");

    await page.waitForTimeout(3000);

    const messageElement = await page.waitForSelector(
      `.text-content.clearfix.with-meta.with-outgoing-icon:has-text("@${name}")`,
      {
        state: "attached",
      }
    );

    await messageElement.click({
      state: "attached",
    });

    await page.waitForTimeout(3000);

    await page.keyboard.type("         " + message, { delay: 10 });
    await page.keyboard.press("Enter");

    await page.waitForTimeout(3000);
  } else {
    console.error(
      'Элемент с id "telegram-search-input" не найден на странице.'
    );
  }
};

module.exports = { sendMessage };

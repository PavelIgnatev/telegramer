const searchByUsername = async (page, username) => {
  await page.waitForTimeout(2000);

  const searchInput = await page.waitForSelector("#telegram-search-input", {
    state: "attached",
  });

  await searchInput.click();

  await searchInput.type(username, { delay: 1599 });

  await page.waitForSelector(".ListItem.search-result", {
    state: "attached",
  });
  await page.waitForSelector(".Button.tiny.translucent.round", {
    state: "attached",
  });
  try {
    const showMore = await page.waitForSelector('a:has-text("Show more")', {
      state: "attached",
      timeout: 5000,
    });
    await showMore.click();
    await page.waitForTimeout(5000);
  } catch {}

  try {
    const searchElements = await page.$$(
      `.ListItem.search-result:not(:has-text("subscribe")):not(:has-text("bot")) .handle:has-text("${username}")`
    );

    for (const searchElement of searchElements) {
      const innerText = await searchElement.textContent();
      console.log(innerText.trim(), username);
      if (innerText.trim() === username) {
        await searchElement.click();
        break;
      }
    }
  } catch {
    console.log("Ошибка при клике");
  }
};

module.exports = { searchByUsername };

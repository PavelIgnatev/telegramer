const disableTagRoleDialog = async (page) => {
  await page.waitForSelector('div[role="dialog"]', { state: "attached" });

  await page.addStyleTag({
    content: 'div[role="dialog"] { display: none !important; }',
  });
};

module.exports = { disableTagRoleDialog };

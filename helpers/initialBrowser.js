const { chromium } = require("playwright-extra");
const stealth = require("puppeteer-extra-plugin-stealth");

const { readAccount } = require("../db/account");

const shromiumStealth = stealth();

shromiumStealth.enabledEvasions.delete("user-agent-override");
chromium.use(shromiumStealth);

chromium.plugins.setDependencyDefaults("stealth/evasions/webgl.vendor", {
  vendor: "Pavel",
  renderer: "Rustom",
});

const initialBrowser = async (headless, username) => {
  const { cookies, userAgent } = (await readAccount(username)) ?? {};

  const browser = await chromium.launch({
    headless: headless,
  });

  const context = await browser.newContext({
    userAgent,
    permissions: ["notifications", "microphone", "camera"],
    cursor: "default",
    storageState: {
      cookies,
    },
    proxy: {
      server: "95.31.211.120:40464",
      username: "54fc976344",
      password: "56ddc55334",
    },
  });

  return [context, browser];
};

module.exports = { initialBrowser };

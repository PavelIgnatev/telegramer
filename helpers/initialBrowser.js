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
      server: "95.215.71.191:40018",
      username: "647d6529f5",
      password: "96bd465f6b",
    },
  });

  return [context, browser];
};

module.exports = { initialBrowser };

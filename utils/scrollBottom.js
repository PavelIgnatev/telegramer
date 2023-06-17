const scrollBottom = async (page, selector) => {
  await page.waitForSelector(selector);

  await page.evaluate(async (selector) => {
    const element = document.querySelector(selector);

    if (element) {
      const scrollTo = element.scrollHeight + 10000000;
      const duration = 5000;
      const startTime = Date.now();

      while (true) {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;

        if (elapsed > duration) {
          element.scrollTop = scrollTo;
          break;
        } else {
          const progress = elapsed / duration;
          element.scrollTop = Math.floor(progress * scrollTo);
        }

        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
    }
  }, selector);
};

module.exports = { scrollBottom };

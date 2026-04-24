const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('file:///Users/richakandoi/Documents/my-web-projects/richa-portfolio/index.html');
  const d = await page.evaluate(() => {
    return {
      nav: document.querySelector('.nav-inner').getBoundingClientRect(),
      navBrand: document.querySelector('.nav-brand').getBoundingClientRect(),
      navCta: document.querySelector('.nav-cta').getBoundingClientRect(),
      cardsStack: document.querySelector('.cards-stack').getBoundingClientRect(),
      pageContainer: document.querySelector('.page-container').getBoundingClientRect(),
    }
  });
  console.log(JSON.stringify(d, null, 2));
  await browser.close();
})();

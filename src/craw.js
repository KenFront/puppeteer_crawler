const fs = require('fs');
const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.google.com.tw/search?q=javascript');
    const body = await page.evaluate(() => {
        const dom = document.querySelectorAll('.srg >.g .r a')
        let result = ''
        dom.forEach(e => {
            result += `${e.innerHTML}\n`
        })
        return result
    });
    if (!fs.existsSync('report')) {
        fs.mkdirSync('report');
    }
    fs.writeFileSync('report/full.txt', body);
    await page.screenshot({ path: 'report/page.png', fullPage: true });

    await browser.close();
})();
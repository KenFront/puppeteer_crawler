const fs = require('fs')
const puppeteer = require('puppeteer')
const craw = async ({ url, script, text, img }) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    const body = await page.evaluate(script)
    fs.writeFileSync(`report/${text}`, body)
    await page.screenshot({ path: `report/${img}`, fullPage: true })
    await browser.close()
}
module.exports = craw
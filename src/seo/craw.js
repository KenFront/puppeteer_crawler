const fs = require('fs')
const puppeteer = require('puppeteer')
const config = require('./config')
const craw = async ({ url, script, text, img }) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url)
  const body = await page.evaluate(script)
  fs.writeFileSync(`${config.output}${text}`, body)
  await page.screenshot({ path: `${config.output}${img}`, fullPage: true })
  await browser.close()
}
module.exports = craw

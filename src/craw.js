const fs = require('fs')
const puppeteer = require('puppeteer')
describe('craw', function () {
    this.timeout(5000)
    it('google', async () => {
        if (!fs.existsSync('report')) {
            fs.mkdirSync('report')
        }
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto('https://www.google.com.tw/search?q=javascript')
        const body = await page.evaluate(() => {
            const dom = document.querySelectorAll('.srg >.g .r a')
            let result = ''
            dom.forEach(e => {
                result += `${e.innerHTML}\n`
            })
            return result
        })
        fs.writeFileSync('report/google.txt', body)
        await page.screenshot({ path: 'report/google.png', fullPage: true })
    
        await browser.close()
    })
})
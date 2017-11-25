const fs = require('fs')
const puppeteer = require('puppeteer')
const config = require('./config')
const nowTime = new Date()
const fileName = `d${nowTime.getDate()}_h${nowTime.getHours()}_m${nowTime.getMinutes()}`
const craw = async ({ url, getMaxPage, getLink, getContent, fileType, imgType }) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    const maxPage = await page.evaluate(getMaxPage)
    let stock = ''
    for (let p = 1; p <= Number(maxPage); p++) {
        console.log(`${url}&page=${p}`)
        await page.goto(`${url}page=${p}`)
        const allLink = await page.evaluate(getLink)
        for (let i in allLink) {
            if (Number(i) > -1 && /^https\:\/\/www\.amazon\.co\.jp\//.test(allLink[i])) {
                await page.goto(allLink[i])
                const content = await page.evaluate(getContent)
                const count = require('../util/getOrder').count
                if (content.title.indexOf(config.keyword) > -1 &&
                    content.logistic.indexOf(config.logistic) > -1 &&
                    content.price >= config.minPrice &&
                    content.price <= config.maxPrice) {
                    stock += `${count}：\n link：${content.link}\n price：${content.price}\n\n\n`
                    await page.screenshot({ path: `${config.output}${fileName}/amazon_${count}${imgType}`, fullPage: false })
                }
            }
        }
    }
    fs.writeFileSync(`${config.output}${fileName}/amazon_link${fileType}`, stock)
    await browser.close()
}
describe('craw', () => {
    before(() => {
        if (!fs.existsSync(config.output)) {
            fs.mkdirSync(config.output)
            if (!fs.existsSync(config.output + fileName)) {
                fs.mkdirSync(config.output + fileName)
            }
        }
    })
    it('amazon', craw.bind(this, {
        url: `https://www.amazon.co.jp/s/?field-keywords=${config.keyword}`,
        getMaxPage: () => {
            const dom = document.querySelector('#pagn .pagnDisabled')
            let page = dom.innerText

            return page
        },
        getLink: () => {
            const dom = document.querySelectorAll('.a-link-normal.s-access-detail-page.s-color-twister-title-link.a-text-normal')
            let allLink = []
            dom.forEach(e => {
                allLink.push(e.getAttribute('href'))
            })
            return allLink
        },
        getContent: () => {
            const link = location.href
            const title = document.getElementById('productTitle')
            const logistic = document.getElementById('merchant-info')
            const price = document.getElementById('priceblock_ourprice')
            let titleVal = title ? title.innerText : ''
            let logisticVal = logistic ? logistic.innerText : ''
            let priceVal = price ? price.innerText.replace('￥ ','').replace(/\,/,'') : ''
            return {
                title: titleVal,
                logistic: logisticVal,
                price: priceVal,
                link
            }
        },
        fileType: '.txt',
        imgType: '.png'
    }))
})
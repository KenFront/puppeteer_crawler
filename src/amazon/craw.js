const fs = require('fs')
const puppeteer = require('puppeteer')
const config = require('./config')
const nowTime = new Date()
const fileName = `d${nowTime.getDate()}_h${nowTime.getHours()}_m${nowTime.getMinutes()}`
const opts = {
  // headless: false,
  defaultViewport: null,
  args: ['--disable-infobars'],
}
const craw = async ({
  url,
  getMaxPage,
  getLink,
  getContent,
  fileType,
  imgType,
}) => {
  const browser = await puppeteer.launch(opts)
  const page = await browser.newPage()
  await page.goto(url)
  const maxPage = await page.evaluate(getMaxPage)
  let stock = ''
  for (let p = 1; p <= Number(maxPage); p++) {
    console.log(`${url}&page=${p}`)
    await page.goto(`${url}&page=${p}`)
    const allLink = await page.evaluate(getLink)
    for (const i in allLink) {
      await page.goto(`https://www.amazon.co.jp${allLink[i]}`)
      const content = await page.evaluate(getContent)
      // console.log(content)
      const count = require('../util/getOrder').count
      const check = () => {
        const res = []
        if (config.keyword.length > 0) {
          res.push(
            config.keyword.some((e) =>
              new RegExp(e.trim().toLowerCase()).test(
                content.title.trim().toLowerCase(),
              ),
            ),
          )
        }
        if (config.solder.length > 0) {
          res.push(
            config.solder.some((e) =>
              new RegExp(e.trim().toLowerCase()).test(
                content.solder.trim().toLowerCase(),
              ),
            ),
          )
        }
        res.push(content.price >= config.minPrice)
        res.push(content.price <= config.maxPrice)
        return res.every((e) => e)
      }
      if (check()) {
        console.log('找到了')
        stock += `${count}：\n link：${content.link}\n price：${content.price}\n\n\n`
        await page.screenshot({
          path: `${config.output}${fileName}/amazon_${count}${imgType}`,
          fullPage: false,
        })
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
    }
    if (!fs.existsSync(config.output + fileName)) {
      fs.mkdirSync(config.output + fileName)
    }
  })
  it(
    'amazon',
    craw.bind(this, {
      url: `https://www.amazon.co.jp/s/?field-keywords=${config.searchword.replace(
        /\s/g,
        '+',
      )}`,
      getMaxPage: () => {
        const dom = document.querySelectorAll('#search li.a-disabled')
        const page = dom.length > 0 ? dom[dom.length - 1].innerText : 1

        return page
      },
      getLink: () => {
        const dom = document.querySelectorAll('.a-link-normal')
        const allLink = []
        dom.forEach((e) => {
          allLink.push(e.getAttribute('href'))
        })
        return allLink.filter((e) => /^\/gp\/slredirect\//.test(e))
      },
      getContent: () => {
        const link = location.href
        const title = document.getElementById('productTitle')
        const solder = document.querySelector('#merchant-info a')
        const price = document.getElementById('priceblock_ourprice')
        const titleVal = title ? title.innerText : ''
        const solderVal = solder ? solder.innerText : ''
        const priceVal = price
          ? price.innerText.trim().replace('￥', '').replace(/,/g, '')
          : ''
        return {
          title: titleVal,
          solder: solderVal,
          price: priceVal,
          link,
        }
      },
      fileType: '.txt',
      imgType: '.png',
    }),
  )
})

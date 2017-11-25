const fs = require('fs')
const craw = require('./craw')
const config = require('./config')
describe('craw', () => {
    before(() => {
        if (!fs.existsSync(config.output)) {
            fs.mkdirSync(config.output)
        }
    })
    it('google', craw.bind(this, {
        url: `https://www.google.com.tw/search?q=${config.keyword}`,
        script: () => {
            const dom = document.querySelectorAll('.srg >.g .r a')
            let result = ''
            dom.forEach(e => {
                result += `${e.innerHTML}\n`
            })
            return result
        },
        text: 'google.txt',
        img: 'google.png'
    }))
    it('yahoo', craw.bind(this, {
        url: `https://tw.search.yahoo.com/search?p=${config.keyword}`,
        script: () => {
            const dom = document.querySelectorAll('ol.searchCenterMiddle .compTitle.options-toggle a')
            let result = ''
            dom.forEach(e => {
                result += `${e.innerHTML}\n`
            })
            return result
        },
        text: 'yahoo.txt',
        img: 'yahoo.png'
    }))
    it('msn', craw.bind(this, {
        url: `https://www.bing.com/search?q=${config.keyword}`,
        script: () => {
            const dom = document.querySelectorAll('#b_results .b_algo h2 a')
            let result = ''
            dom.forEach(e => {
                result += `${e.innerHTML}\n`
            })
            return result
        },
        text: 'msn.txt',
        img: 'msn.png'
    }))
})
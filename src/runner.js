const fs = require('fs')
const craw = require('./craw')
describe('craw', () => {
    before(() => {
        if (!fs.existsSync('report')) {
            fs.mkdirSync('report')
        }
    })
    it('google', craw.bind(this, {
        url: 'https://www.google.com.tw/search?q=javascript',
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
    })).timeout(5000)
    it('yahoo', craw.bind(this, {
        url: 'https://tw.search.yahoo.com/search?p=javascript',
        script: () => {
            const dom = document.querySelectorAll('ol.searchCenterMiddle .compTitle.options-toggle a')
            let result = ''
            dom.forEach(e => {
                result += `${e.innerHTML}\n`
            })
            const fix = result.replace(/\<b\>Java[s|S]?cript\<\/b\>/g, 'JavaScript')
            return fix
        },
        text: 'yahoo.txt',
        img: 'yahoo.png'
    })).timeout(5000)
    it('msn', craw.bind(this, {
        url: 'https://www.bing.com/search?q=javascript',
        script: () => {
            const dom = document.querySelectorAll('#b_results .b_algo h2 a')
            let result = ''
            dom.forEach(e => {
                result += `${e.innerHTML}\n`
            })
            const fix = result.replace(/\<strong\>Java[s|S]?cript\<\/strong\>/g, 'JavaScript')
            return fix
        },
        text: 'msn.txt',
        img: 'msn.png'
    })).timeout(5000)
})
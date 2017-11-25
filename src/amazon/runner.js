const spawn = require('cross-spawn')
const config = require('./config')
spawn('mocha', ['src/amazon/craw.js','--no-timeouts'], {
    stdio: 'inherit'
})
setInterval(() => {
    spawn('mocha', ['src/amazon/craw.js','--no-timeouts'], {
        stdio: 'inherit'
    })
}, config.once*1000*60)
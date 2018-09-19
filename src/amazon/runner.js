const { spawnSync } = require('child_process')
const config = require('./config')
const task = () => {
  spawnSync('mocha', ['src/amazon/craw.js', '--no-timeouts'], {
    stdio: 'inherit',
  })
}
const run = () => {
  task()
  setTimeout(run, config.once * 1000 * 60)
}
run()

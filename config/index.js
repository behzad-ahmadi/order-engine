 
const path = require('path')
require('dotenv-flow').config({
  cwd: path.join(__dirname, '../'),
  purge_dotenv: true,
  default_node_env: 'development'
})

module.exports = {
  debug: (process.env.DEBUG === 'true'),
  server: Object.freeze({
    port: parseInt(process.env.PORT)
  })
}
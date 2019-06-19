const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const server = require('http').createServer(app)
const engine = require('./engine')

app.use(bodyParser.json())
app.post('/sell', engine.processSellOrder)
app.post('/buy', engine.processBuyOrder)

module.exports = {
  http: server,
  express: app
}
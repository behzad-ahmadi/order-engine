const config = require('./config')
const server = require('./lib/server')
const port = process.argv[2] || config.server.port

server.http.listen(port, () => console.log(`Server instance bound to port ${port}!`))

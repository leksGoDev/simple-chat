const express = require('express')
const http = require('http')
const WebSocket = require('ws')

const PORT = 3000
const app = express()
const server = http.createServer(app)
const webSocketServer = new WebSocket.Server({server})
const root = __dirname + '/public'

app.use(express.static(root))
app.get('/', (request, response)=>{
    response.sendFile(root + '/index.html')
})

webSocketServer.on('connection', ws => {
    ws.on('message', message => {
        message = JSON.parse(message)
        webSocketServer.clients.forEach(client => client.send(JSON.stringify(message)))
    })
    ws.on('error', err => ws.send(err))
})

server.listen(PORT, () => console.log(`Server started at port ${PORT}.`))
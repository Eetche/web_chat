const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
    console.log('user connected')

    socket.on('disconnect', (pseudo) => {
        console.log(pseudo + " disconnected")
    });

    socket.on('chat message', (data) => {
        console.log("pseudo: " + data.pseudo)
        console.log("message: " + data.input)
        io.emit('chat message', data)
    })
});

server.listen(3000, () => {
    console.log('listening on: 3000')
})

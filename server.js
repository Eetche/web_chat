const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server, {
    maxHttpBufferSize: 1e8
})

app.get('/', (req, res) => {
    res.sendFile( __dirname + '/registration.html')
})

app.use(express.static(__dirname))

let online = io.sockets.sockets.size

io.on('connection', (socket) => {
    online = io.sockets.sockets.size

    console.log('user connected')

    socket.emit('connec', online)

    socket.join("global")

    socket.on('disconnect', () => {
        online = io.sockets.sockets.size
        socket.emit("disconnec", online + 1)
        socket.leave(socket.rooms[0])
        console.log("user disconnected")
    });

    socket.on('chat message', (data) => {
        console.log(socket.rooms)
        if (socket.rooms.size == 3) {
            socket.to("global").emit("chat message", data)
            console.log("socket don't have room")
        } else {
            socket.to(socket.room).emit("chat message", data)
        }
    })

    socket.on('inputing', (data) => {
        socket.broadcast.emit('inputing', data)
    })

    socket.on('join', (data) => {
        if (socket.rooms.size < 3) {
            socket.leave('global')
            socket.join(data.roomName)
            console.log(socket.rooms)
            socket.room = data.roomName
            console.log("id: " + socket.id + " join to room named: " + data.roomName)
            socket.emit("join", data)
        }
    })
});

server.listen(3000, () => {
    console.log('listening on: 3000')
})

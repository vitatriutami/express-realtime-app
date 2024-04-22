const express = require("express")
const app = express()

const http = require("http")
const server = http.createServer(app)
const SocketIO = require("socket.io").Server

const io = new SocketIO(server)

let users = []

// socket io connection
io.on("connection", (socket) => {
    console.log(`new websocket connection id: ${socket.id}`)

    let currentUser = "anonymous"
    socket.on("register", (username) => {
        currentUser = username
        if (users.indexOf(username) < 0) {
            users.push(username)
        }
        socket.broadcast.emit("new.user", users)
        socket.emit("new.user", users)
    })
    
    socket.broadcast.emit("new.user", users)
    socket.emit("new.user", users)


    socket.on("direct.message", (data) => {
        socket.broadcast.emit(`direct.message.${data.to}`, data.text)
    })

    // ...
    socket.on("message", (data) => {
        if (data && data.room && data.text) {
            console.log(data)
            // kirim ke user lain
            socket.broadcast.emit(`message.${data.room}`, data.text)
    
            // kirim ke sender
            socket.emit(`notif.${data.room}`, "message sent!")
        }
    })

    socket.on("disconnect", () => {
        console.log(`client disconnect: ${socket.id}`)
    })
})

app.get("/", (req, res) => {
    res.sendFile("ws.html", {root: "."})
})

server.listen(4000, () => {
    console.log(`server running on port 4000`)
})
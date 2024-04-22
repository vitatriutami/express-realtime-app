const express = require("express")
const app = express()
const fs = require("fs")

app.get("/", (req, res) => {
    res.sendFile("sse.html", {root: "."})
})

app.get("/events", (req, res) => {
    console.log(`opening new connection`)

    res.set({
        "Cache-control": "no-cache",
        "Content-type": "text/event-stream",
        "Connection": "keep-alive"
    })
    res.flushHeaders()

    res.write("retry: 5000\n\n")

    let id = 1
    let interval = setInterval(() => {
        let notif = fs.readFileSync("public/notif.json")
        let notifData = JSON.parse(notif.toString())

        res.write(`id: ${id}\n`)
        res.write(`event: notif\n`)
        res.write(`data: ${notifData.message}\n\n`)
        id++
    }, 5000)

    res.on("close", () => {
        clearInterval(interval)
        console.log("closing connection")
        res.end()
    })
})

app.listen(4000, () => {
    console.log(`server is running on port 4000`)
})
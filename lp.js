const express = require("express")
const app = express()
const fs = require("fs")

app.get("/", (req, res) => {
    res.sendFile("lp.html", {root: "."})
})
app.get("/notif", (req, res) => {
    const data = fs.readFileSync("public/notif.json")
    const notif = JSON.parse(data.toString())
    notif.date = new Date()

    res.json(notif)
})
app.listen(4000, () => {
    console.log(`Server running on port 4000`)
})

const express = require("express")
const app = express()

// endpoint tampilkan video
app.use("public", express.static("public"))
app.get("/", (req, res) => {
    res.sendFile("sp.html", {root: "."})
})

app.listen(4000, () => {
    console.log(`server is running on port 4000`)
})
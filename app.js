import express from "express";
import env from "dotenv"

const server = express()

env.config()

const PORT = process.env.PORT

server.get("/", (req, res) => {
    res.json({"msg": "Welcome To Our Book Store"})
})

server.get("/health", (req, res) => {
    res.json({message: "server is on"})
})




server.listen(PORT, () => console.log(`Listenning to port ${PORT}`))
import express from "express";
import env from "dotenv";
import productsRouter from "./routers/products.js";
import cartRouter from "./routers/cart.js"
import {fail, success} from "./services/responses.js"


const server = express()
env.config()
const PORT = process.env.PORT


server.use("/products", productsRouter)
server.use("/cart", cartRouter)

server.get("/", (req, res) => {
    try {
       res.send(success({message: "Welcome To Our Book Store"})) 
    } catch (error) {
        console.error(error)
        res.status(500).send(fail("Internal Server Error"))
    }
})

server.get("/health", (req, res) => {
    try {
        res.send(success({message: "server is on"}))
    } catch (error) {
        console.error(error.message)
        res.status(500).send(fail("Internal Server Error"))
    }
})



server.listen(PORT, () => console.log(`Listenning to port ${PORT}`))
import express from "express";
import { getOrdersByCustomerId, checkout } from "./ordersController.js";


const router = express.Router()


router.get("/" ,(req, res) => {
    getOrdersByCustomerId(req, res)
})

router.post("/checkout", (req, res) => {
    checkout(req, res)
})


export default router
import express from "express";
import { readBooksFile, readCustomersFile, writeCustomersFile } from "../services/io.js";
import { fail, success } from "../services/responses.js";
import { addItemToCart, getCart, removeItemFromCart } from "./cartController.js"



const router = express.Router();

router.use(express.json());

router.get("/", async (req, res) => {
    getCart(req, res)
});

router.post("/items", async (req, res) => {
    console.log(req.body)
        addItemToCart(req, res)
});


router.delete("/items/:productId", async (req, res) => {
    removeItemFromCart(req, res)
})
export default router;



import express from "express";
import { readBooksFile } from "../services/io.js";
import { fail, success } from "../services/responses.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        let books = await readBooksFile();

        const { inStock, maxPrice, search } = req.query;

        if (inStock) books = books.filter((book) => book.stock > 0);
        if (maxPrice) books = books.filter((book) => book.price <= maxPrice);
        if (search) {
            books = books.filter((book) =>
                book.name.toLowerCase().includes(search.toLowerCase()),
            );
        }
        res.send(success(books));
    } catch (error) {
        res.status(500).send(fail("Internal Server Error"))
    }
});

export default router;

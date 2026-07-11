import express from "express";
import { readBooksFile, readCustomersFile, writeCustomersFile } from "../services/io.js";
import { fail, success } from "../services/responses.js";
import z from "zod";
import { valid } from "../services/validator.js";


const itemSchema = z.object({
    productId: z.string().min(1),
    customerId: z.number().int().min(1),
    quantity: z.number().int().min(1),
});

const router = express.Router();

router.use(express.json());

router.get("/", async (req, res) => {
    try {
        const customers = await readCustomersFile();
        const { customerId } = req.query;
        const customer = customers.find(
            (customer) => customer.customerId === +customerId,
        );
        if (!customer)
            return res
                .status(404)
                .send(fail(`customer ${customerId} not found`));
        res.send(success(customer.cart));
    } catch (error) {
        console.error(error);
        res.status(500).send(fail("Internal Server Error"));
    }
});

router.post("/items", async (req, res) => {
    try {
        const validItem = itemSchema.safeParse(req.body);
        if (!validItem.success) {
            return res.status(400).send(fail(JSON.parse(validItem.error)));
        }
        const {productId, customerId, quantity} = validItem.data

        const allProducts = await readBooksFile()
        const product = allProducts.find(product => product.productId === productId)
        if (!product) return res.status(404).send(fail(`product ${productId} not found`))


        

        const customers = await readCustomersFile();
        const customer = customers.find(
            (customer) => customer.customerId === customerId,
        );
        if (!customer)
            return res
                .status(404)
                .send(fail(`customer ${customerId} not found`));
        
        const cart = customer.cart
        const existingItem = cart.find(item => item.productId === productId)
        if (!existingItem) {
            if (!valid.hasEnoughInStock(productId, quantity)) {
                return res.status(400).send(fail("quantity out of stock"))
            }
            cart.push({productId, quantity})
        } else {
            if (!valid.hasEnoughInStock(productId, existingItem.quantity + quantity)) {
                return res.status(400).send("quantity out of stock")
            }
            existingItem.quantity += quantity
        }
        await writeCustomersFile(customers)

        return res.send(success(`item added to cart`))
    } catch (error) {
        console.error(error.message)
        res.status(500).end(fail("Internal Server Error"));
    }
});

export default router;



import z from "zod";
import { findCustomer, findProduct } from "../services/logic.js";
import { valid } from "../services/validator.js";
import { fail, success } from "../services/responses.js";
import {
    readBooksFile,
    readCustomersFile,
    writeCustomersFile,
} from "../services/io.js";

const cartItemSchema = z.object({
    productId: z.number().min(1),
    customerId: z.number().int().min(1),
    quantity: z.number().int().min(1),
});

export async function addItemToCart(req, res) {
    try {
        //validation of request body
        const validItem = cartItemSchema.safeParse(req.body);
        if (!validItem.success) {
            return res.status(400).send(fail(JSON.parse(validItem.error)));
        }
        const { productId, customerId, quantity } = validItem.data;

        //check if proudct Id and customer Id exist
        const allProducts = await readBooksFile();
        const product = findProduct(allProducts, productId);
        if (!product)
            return res.status(404).send(fail(`product ${productId} not found`));

        const customers = await readCustomersFile();
        const customer = findCustomer(customers, customerId);
        if (!customer)
            return res
                .status(404)
                .send(fail(`customer ${customerId} not found`));

        // add item to cart. if exist - change the quantity, if not exist - add it.
        // also check if there is enough of this item in stock before adding it to the cart.
        const cart = customer.cart;
        const existingItem = cart.find((item) => item.productId === productId);
        if (!existingItem) {
            if (!valid.hasEnoughInStock(allProducts, productId, quantity)) {
                return res.status(400).send(fail("quantity out of stock"));
            }
            cart.push({ productId, quantity });
        } else {
            if (
                !valid.hasEnoughInStock(
                    allProducts,
                    productId,
                    existingItem.quantity + quantity,
                )
            ) {
                return res.status(400).send("quantity out of stock");
            }
            existingItem.quantity += quantity;
        }

        // write changes to file
        await writeCustomersFile(customers);

        return res.send(success(`item added to cart`));
    } catch (error) {
        console.error(error);
        res.status(500).end(fail("Internal Server Error"));
    }
}

export async function getCart(req, res) {
    try {
        const { customerId } = req.query;
        const customers = await readCustomersFile();
        const customer = findCustomer(customers, customerId);
        console.log(customer);
        if (!customer)
            return res
                .status(404)
                .send(fail(`customer ${customerId} not found`));
        res.send(success(customer.cart));
    } catch (error) {
        console.error(error);
        res.status(500).send(fail("Internal Server Error"));
    }
}

export async function removeItemFromCart(req, res) {
    try {
        // extract data
        const productId = +req.params.productId;
        const customerId = +req.query.customerId;

        // find the customer fo the cart
        const allCustomers = await readCustomersFile();
        const customer = findCustomer(allCustomers, customerId);
        if (!customer) return res .status(404).send(fail(`customer ${customerId} not found`));

        // find the item in the cart
        const cart = customer.cart;
        const itemIndex = cart.findIndex((item) => item.productId === productId);
        if (itemIndex === -1) return res.status(404).send(fail(`product ${productId} is not in cart`));

        //remove the item from the cart
        cart.splice(itemIndex, 1);
        writeCustomersFile(allCustomers);
        return res.send(success(`product ${productId} removed from cart`));

    } catch (error) {
        console.error(error.message);
        res.status(500).send(fail("Internal Server Error"));
    }
}

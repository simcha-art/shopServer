import {
    readOrdersFile,
    readBooksFile,
    readCustomersFile,
    writeCustomersFile,
    writeOrdersFile,
    writeBooksFile,
} from "../services/io.js";
import { findCustomer, findProduct } from "../services/logic.js";
import { fail, success } from "../services/responses.js";

export async function getOrdersByCustomerId(req, res) {
    try {
        const { customerId } = req.query;
        if (!customerId)
            return res.status(400).send(fail("customer id is missing"));

        const allOrders = await readOrdersFile();
        const ordersOfCustomer = allOrders.filter(
            (order) => order.customerId === +customerId,
        );
        res.send(success(ordersOfCustomer));
    } catch (error) {
        console.error(error.message);
        res.status(500).send(fail("Internal Server Error"));
    }
}

export async function checkout(req, res) {
    // 1. is valid query
    // 2. is cart full
    // 3. are products exist
    // 4. are products in stock
    // 5. is enough money to customer
    // 6. make a new order
    // 7. change quantity of books
    // 8. reduce customer's balance

    try {
        const orderItems = [];

        const customerId = +req.body.customerId;
        if (!customerId)
            return res.status(400).send(fail("customer id is missing"));

        // finding the customer and his cart
        const allCustomers = await readCustomersFile();
        const customer = findCustomer(allCustomers, customerId);
        const cart = customer.cart;

        // is cart full
        if (cart.length === 0)
            return res.status(400).send(fail("cart is empty"));

        // is products still exist and in stock
        const allProducts = await readBooksFile();
        for (const product of cart) {
            const { productId, quantity } = product;
            const existProduct = findProduct(allProducts, productId);
            if (!existProduct) {
                return res
                    .status(404)
                    .send(fail(`product ${productId} isn't exist anymore`));
            } else if (existProduct.stock < product.quantity) {
                return res
                    .status(404)
                    .send(
                        fail(
                            `stock has less then ${quantity} from product ${productId}`,
                        ),
                    );
            }
            orderItems.push({ productId, quantity, price: existProduct.price });
            existProduct.stock -= quantity;
        }

        // is enough money
        const total = orderItems.reduce(
            (acc, product) => acc + product.price * product.quantity,
            0,
        );
        if (customer.balance < total)
            return res
                .status(400)
                .send(
                    fail(`customer ${customerId} does not have enough money`),
                );
        customer.balance = customer.balance - total;
        customer.cart = [];

        // make a new order
        const allOrders = await readOrdersFile();
        const newId = Math.max(0, ...allOrders.map((order) => order.id)) + 1;
        const newOrder = {
            id: newId,
            customerId,
            items: orderItems,
            total,
            createdAt: new Date(),
        };
        allOrders.push(newOrder);

        await Promise.all([
            writeBooksFile(allProducts),
            writeCustomersFile(allCustomers),
            writeOrdersFile(allOrders),
        ]);

        res.send(
            success(
                `order created successfully for customer ${customerId}, order id: ${newId}`,
            ),
        );
    } catch (error) {
        console.error(error);
        res.status(500).send(fail("Internal Server Error"));
    }
}

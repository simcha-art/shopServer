import zod from "zod";
import { findCustomer, findProduct } from "../services/logic.js";
import { valid } from "../services/validator.js";


const cartItemSchema = z.object({
    productId: z.string().min(1),
    customerId: z.number().int().min(1),
    quantity: z.number().int().min(1),
});

export async function addItemToCart(body) {
    //validation of request body
    const validItem = cartItemSchema.safeParse(body);
    if (!validItem.success) {
        return res.status(400).send(fail(JSON.parse(validItem.error)));
    }
    const { productId, customerId, quantity } = validItem.data;

    //check if proudct Id and customer Id exist
    const product = await findProduct(productId)
    if (!product)
        return res.status(404).send(fail(`product ${productId} not found`));

    const customer = await findCustomer(customerId)
    if (!customer)
        return res.status(404).send(fail(`customer ${customerId} not found`));

    // add item to cart. if exist - change the quantity, if not exist - add it.
    // also check if there is enough of this item in stock before adding it to the cart.
    const cart = customer.cart;
    const existingItem = cart.find((item) => item.productId === productId);
    if (!existingItem) {
        if (!valid.hasEnoughInStock(productId, quantity)) {
            return res.status(400).send(fail("quantity out of stock"));
        }
        cart.push({ productId, quantity });
    } else {
        if (
            !valid.hasEnoughInStock(productId, existingItem.quantity + quantity)
        ) {
            return res.status(400).send("quantity out of stock");
        }
        existingItem.quantity += quantity;
    }
    
    // write changes to file
    await writeCustomersFile(customers);

    return res.send(success(`item added to cart`));
}

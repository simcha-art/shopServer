import { custom } from "zod";
import { readBooksFile, readCustomersFile } from "./io.js";

export async function findProduct(productId) {
    const allProducts = await readBooksFile();
    const product = allProducts.find(
        (product) => product.productId === productId,
    );
}
export async function findCustomer(customerId) {
    const customers = await readCustomersFile();
    const customer = customers.find(
        (customer) => customer.customerId === customerId,
    );
}

import { custom } from "zod";
import { readBooksFile, readCustomersFile } from "./io.js";

export async function findProduct(allProducts, productId) {
    const product = allProducts.find(
        (product) => +product.id === +productId,
    );
    return product
}
export function findCustomer(customers, customerId ) {
    const customer = customers.find(
        (customer) => +customer.customerId === +customerId,
    );
    return customer
}

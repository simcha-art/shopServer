import { findCustomer } from "../services/logic.js";
import { readCustomersFile } from "../services/io.js";
import { fail, success } from "../services/responses.js";


export async function getBalance(req, res) {
    try {
        const { customerId } = req.query;
        const allCustomers = await readCustomersFile();
        const customer = findCustomer(allCustomers, customerId);
        if (!customer)
            return res
                .status(404)
                .send(fail(`customer ${customerId} not found`));
        return res.send(success({ balance: customer.balance }));
    } catch (error) {
        console.error(error.message);
        res.status(500).send(fail("Internal Server Error"));
    }
}

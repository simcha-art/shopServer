import env from "dotenv";
import fs from "fs/promises";

env.config();
const DB_BOOKS = process.env.DB_BOOKS;
const DB_ORDERS = process.env.DB_ORDERS;
const DB_CUSTOMERS = process.env.DB_CUSTOMERS;

const readBooksFile = () => fs.readFile(DB_BOOKS, "utf8").then((data) => JSON.parse(data));
const readOrdersFile = () => fs.readFile(DB_ORDERS, "utf8").then((data) => JSON.parse(data));
const readCustomersFile = () => fs.readFile(DB_CUSTOMERS, "utf8").then((data) => JSON.parse(data));

const writeBooksFile = (data) => fs.writeFile(DB_BOOKS, JSON.stringify(data, null, 2));
const writeOrdersFile = (data) => fs.writeFile(DB_ORDERS, JSON.stringify(data, null, 2));
const writeCustomersFile = (data) => fs.writeFile(DB_CUSTOMERS, JSON.stringify(data, null, 2));

export {
    readBooksFile,
    readOrdersFile,
    readCustomersFile,
    writeBooksFile,
    writeOrdersFile,
    writeCustomersFile,
};

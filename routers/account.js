import express from "express";
import { getBalance } from "./accountController.js";


const router = express.Router();

router.get("/balance", async (req, res) => {
    getBalance(req, res)
});

export default router;

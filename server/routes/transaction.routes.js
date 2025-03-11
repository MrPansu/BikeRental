import express from "express";

import {
  getAllTransactions,
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "../controllers/transaction.controller.js";

const router = express.Router();

router.get("/", getAllTransactions);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);
router.put("/:id", updateTransaction);

export default router;

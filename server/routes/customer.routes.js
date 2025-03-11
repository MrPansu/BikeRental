import express from "express";

import {
  getAllCustomer,
  createCustomer,
  deleteCustomer,
  updateCustomer,
} from "../controllers/customer.controller.js";

const router = express.Router();

router.get("/", getAllCustomer);
router.post("/", createCustomer);
router.delete("/:id", deleteCustomer);
router.put("/:id", updateCustomer);

export default router;

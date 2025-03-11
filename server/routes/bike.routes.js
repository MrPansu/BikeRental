import express from "express";

import {
  getAllBike,
  createBike,
  deleteBike,
  updateBike,
} from "../controllers/bike.controller.js";

const router = express.Router();

router.get("/", getAllBike);
router.post("/", createBike);
router.delete("/:id", deleteBike);
router.put("/:id", updateBike);

export default router;

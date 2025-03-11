import e from "express";

import {
  getAllUser,
  createUser,
  deleteUser,
  updateUser,
} from "../controllers/user.controller.js";

const router = e.Router();

router.get("/", getAllUser);
router.post("/", createUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

export default router;

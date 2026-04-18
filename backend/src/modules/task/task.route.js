import express from "express";
import { createTask } from "./task.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js`";

const router = express.Router();

router.post("/", verifyToken, createTask);
router.get("/", (req, res) => {
  res.send("Task route OK");
});

export default router;

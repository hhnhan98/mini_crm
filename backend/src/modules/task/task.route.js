import express from "express";
import { verifyToken } from "../../middlewares/verifyToken.js";
import {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
  updateStatus,
} from "./task.controller.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", createTask);
router.get("/", getTasksByProject);
router.put("/:taskId", updateTask);
router.patch("/:taskId/status", updateStatus); // dùng patch thay vì put vì chỉ update 1 field (status)
router.delete("/:taskId", deleteTask);

export default router;

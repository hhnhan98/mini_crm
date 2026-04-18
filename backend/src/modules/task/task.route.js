import express from "express";
import { verifyToken } from "../../middlewares/verifyToken.js";
import {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
} from "./task.controller.js";

const router = express.Router();

router.post("/", verifyToken, createTask);
router.get("/", verifyToken, getTasksByProject);
router.put("/:id", verifyToken, updateTask);
router.delete("/:id", verifyToken, deleteTask);

export default router;

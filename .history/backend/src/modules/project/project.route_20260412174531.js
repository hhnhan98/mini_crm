import express from "express";
import * as projectController from "./project.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { checkProjectAccess } from "../../middlewares/checkProjectAccess.js";

const router = express.Router();

// tạo project mới
router.post("/", verifyToken, projectController.createProject);

// GET chi tiết project
router.get(
  "/:projectId",
  verifyToken,
  checkProjectAccess,
  projectController.getDetail
);

export default router;

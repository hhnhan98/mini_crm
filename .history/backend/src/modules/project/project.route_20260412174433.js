import express from "express";
import * as projectController from "./project.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import s'
const router = express.Router();

router.post("/", verifyToken, projectController.createProject);
router.get(
  "/projects/:projectId",
  verifyToken,
  checkProjectAccess,
  projectController.getDetail
);

export default router;

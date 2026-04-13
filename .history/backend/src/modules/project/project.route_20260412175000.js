import express from "express";
import * as projectController from "./project.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { checkProjectAccess } from "../../middlewares/checkProjectAccess.js";

console.log({
  verifyToken,
  checkProjectAccess,
  getDetail: projectController.getDetail,
});

const router = express.Router();

// CREATE PROJECT
router.post("/", verifyToken, projectController.createProject);

// GET PROJECT DETAIL
router.get(
  "/:projectId",
  verifyToken,
  checkProjectAccess,
  projectController.getDetail
);

export default router;

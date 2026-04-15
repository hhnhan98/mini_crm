import express from "express";
import * as projectController from "./project.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { checkProjectRole } from "../../middlewares/checkProjectRole.js";

const router = express.Router();

// CREATE PROJECT
router.post("/", verifyToken, projectController.createProject);

// GET PROJECT DETAIL
router.get(
  "/:projectId",
  verifyToken,
  checkProjectRole(["OWNER", "MEMBER"]),
  projectController.getProjectDetail
);

// GET MEMBERS
router.get(
  "/:projectId/members",
  verifyToken,
  checkProjectRole(["OWNER"]),
  projectController.getMembers
);

export default router;

import express from "express";
import * as projectController from "./project.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { checkProjectRole } from "../../middlewares/checkProjectRole.js";
import { checkProjectAccess } from "../../middlewares/checkProjectAccess.js";

const router = express.Router();

// GET MY PROJECTS
router.get("/", verifyToken, projectController.getMyProjects);

// CREATE PROJECT
router.post("/", verifyToken, projectController.createProject);

// GET MEMBERS
router.get(
  "/:projectId/members",
  verifyToken,
  checkProjectAccess,
  checkProjectRole(["OWNER"]),
  projectController.getMembers
);

// ADD MEMBER
router.post(
  "/:projectId/members",
  verifyToken,
  checkProjectAccess,
  checkProjectRole(["OWNER"]),
  projectController.addMember
);

// GET PROJECT DETAIL
router.get(
  "/:projectId",
  verifyToken,
  checkProjectAccess,
  checkProjectRole(["OWNER", "MEMBER"]),
  projectController.getProjectDetail
);

export default router;

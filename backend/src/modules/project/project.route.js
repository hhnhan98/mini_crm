import express from "express";
import * as projectController from "./project.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { checkProjectAccess } from "../../middlewares/checkProjectAccess.js";
import { authorizeRole } from "../../middlewares/authorizeRole.js";

const router = express.Router();

// CREATE PROJECT
router.post("/", verifyToken, projectController.createProject);

// GET PROJECT DETAIL
router.get(
  "/:projectId",
  verifyToken,
  checkProjectAccess,
  // authorizeRole("ADMIN", "MEMBER"), // Nếu muốn phân quyền chi tiết hơn, có thể sử dụng middleware này
  projectController.getDetail
);

// GET MEMBER OF PROJECT
router.get(
  "/:projectId/members",
  verifyToken,
  checkProjectAccess,
  projectMemberController.getMembers
);
export default router;

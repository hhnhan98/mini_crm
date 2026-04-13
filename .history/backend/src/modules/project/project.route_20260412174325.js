import express from "express";
import * as projectController from "./project.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, projectController.createProject);
router.get("/", verifyToken, projectController.getProjects);
router.get("/:projectId", verifyToken, projectController.getProjectById);
router.put("/:projectId", verifyToken, projectController.updateProject);
router.delete("/:projectId", verifyToken, projectController.deleteProject);

export default router;

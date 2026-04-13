import express from "express";
import * as projectController from "./project.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, projectController.createProject);
router.get("/", verifyToken, projectController.getProjects);
export default router;

import * as projectService from "./project.service.js";

// CREATE PROJECT

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    const project = await projectService.createProject({
      name: name.trim(),
      description,
      userId,
    });

    return res.status(201).json({
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Create project failed",
    });
  }
};

// GET PROJECT DETAIL

export const getProjectDetail = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({
        message: "Project ID is required",
      });
    }

    const project = await projectService.getProjectDetail(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    return res.status(200).json({
      message: "Get project detail successfully",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

// GET MEMBER OF PROJECT
export const getMembers = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({
        message: "Project ID is required",
      });
    }

    const members = await projectService.getMembers(projectId);

    return res.status(200).json({
      message: "Get project members successfully",
      data: members,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

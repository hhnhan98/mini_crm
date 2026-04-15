import * as projectService from "./project.service.js";

// CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    const project = await projectService.createProject({
      name: name.trim(),
      description: description?.trim() || null,
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

// GET MY PROJECTS
export const getMyProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await projectService.getMyProjects(userId);

    return res.status(200).json({
      message: "Get my projects successfully",
      data: projects,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
};

// GET PROJECT DETAIL
export const getProjectDetail = async (req, res) => {
  try {
    const { projectId } = req.params;

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

// GET MEMBERS (pagination)
export const getMembers = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const members = await projectService.getMembers(projectId, {
      page: Number(page),
      limit: Number(limit),
    });

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

// ADD MEMBER
export const addMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { accountId, role } = req.body;

    if (!accountId || !role) {
      return res.status(400).json({
        message: "accountId and role are required",
      });
    }

    const member = await projectService.addMember({
      projectId,
      accountId,
      role,
    });

    return res.status(201).json({
      message: "Member added successfully",
      data: member,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Add member failed",
    });
  }
};

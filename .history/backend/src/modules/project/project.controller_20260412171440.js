import * as projectService from "./project.service.js";

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    const project = await projectService.createProject({
      name,
      description,
      userId: req.user.id,
    });

    res.status(201).json({
      message: "Project created",
      data: project,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

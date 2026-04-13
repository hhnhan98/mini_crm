import * as projectService from "./project.service.js";
import prisma from "../../config/prisma.js";

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

export const getDetail = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        members: {
          include: {
            account: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            dueDate: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    return res.json({
      message: "Project detail",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

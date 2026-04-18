import * as taskService from "./task.service.js";

export const createTask = async (req, res) => {
  try {
    const userId = req.user.id;

    const task = await taskService.createTask(userId, req.body);

    return res.status(201).json({
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message || "Create task failed",
    });
  }
};

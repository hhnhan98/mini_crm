import * as taskService from "./task.service.js";

const handleError = (res, err) => {
  return res.status(err.statusCode || 400).json({
    message: err.message,
  });
};

// CRUD operations for tasks
export const createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.user.id, req.body);

    return res.status(201).json({
      message: "created",
      data: task,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

export const getTasksByProject = async (req, res) => {
  try {
    const data = await taskService.getTasksByProject(req.query, req.user.id);

    return res.json(data);
  } catch (err) {
    return handleError(res, err);
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(
      req.params.id,
      req.user.id,
      req.body
    );

    return res.json({
      message: "updated",
      data: task,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

export const deleteTask = async (req, res) => {
  try {
    await taskService.deleteTask(req.params.id, req.user.id);

    return res.json({
      message: "deleted",
    });
  } catch (err) {
    return handleError(res, err);
  }
};

export const updateStatus = async (req, res) => {
  try {
    const task = await taskService.updateTaskStatus({
      taskId: req.params.taskId,
      newStatus: req.body.status,
      currentUser: req.user,
    });

    return res.json({
      message: "status updated",
      data: task,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

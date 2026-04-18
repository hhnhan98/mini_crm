import prisma from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";
import {
  ensureProjectMember,
  canAssignTask,
  canUpdateTask,
  canDeleteTask,
} from "./task.permission.js";

/* =========================
   CONSTANTS
========================= */
const VALID_PRIORITY = ["LOW", "MEDIUM", "HIGH"];
const VALID_STATUS = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

/* =========================
   CREATE TASK
========================= */
export const createTask = async (userId, payload) => {
  const {
    title = "",
    description,
    projectId,
    assigneeId,
    priority,
    deadline,
  } = payload;

  if (!title.trim()) {
    throw new AppError("title is required", 400);
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  // check member + get role
  const member = await ensureProjectMember(projectId, userId);

  // OPTIONAL RULE (safe default)
  // MEMBER vẫn được tạo task nhưng không được assign người khác nếu muốn siết sau
  if (assigneeId) {
    canAssignTask(member.role);

    const assignee = await prisma.projectMember.findFirst({
      where: {
        projectId,
        accountId: assigneeId,
      },
    });

    if (!assignee) {
      throw new AppError("Assignee must be in project", 400);
    }
  }

  if (priority && !VALID_PRIORITY.includes(priority)) {
    throw new AppError("Invalid priority", 400);
  }

  return prisma.task.create({
    data: {
      title: title.trim(),
      description: description?.trim() || null,
      projectId,
      assigneeId: assigneeId ?? null,
      priority: priority || "MEDIUM",
      deadline: deadline ? new Date(deadline) : null,
      createdById: userId,
    },
  });
};

/* =========================
   GET TASKS BY PROJECT
========================= */
export const getTasksByProject = async (query, userId) => {
  const { projectId, status, search, page = 1, limit = 10 } = query;

  if (!projectId?.trim()) {
    throw new AppError("projectId is required", 400);
  }

  // 🔐 SECURITY FIX: check access
  await ensureProjectMember(projectId, userId);

  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Number(limit) || 10, 50);

  if (status && !VALID_STATUS.includes(status)) {
    throw new AppError("Invalid status", 400);
  }

  const where = {
    projectId: projectId.trim(),
    deletedAt: null,
    ...(status && { status }),
    ...(search && {
      title: { contains: search.trim(), mode: "insensitive" },
    }),
  };

  const [items, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.task.count({ where }),
  ]);

  return {
    data: items,
    meta: {
      total,
      page: safePage,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
};

/* =========================
   UPDATE TASK
========================= */
export const updateTask = async (taskId, userId, payload) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  if (task.deletedAt) {
    throw new AppError("Task already deleted", 400);
  }

  // get member + role
  const member = await ensureProjectMember(task.projectId, userId);

  // 🔐 permission check
  canUpdateTask(member.role, task, userId);

  // validate status
  if (payload.status && !VALID_STATUS.includes(payload.status)) {
    throw new AppError("Invalid status", 400);
  }

  // validate priority
  if (payload.priority && !VALID_PRIORITY.includes(payload.priority)) {
    throw new AppError("Invalid priority", 400);
  }

  // validate assignee
  if (payload.assigneeId !== undefined) {
    canAssignTask(member.role);

    if (payload.assigneeId) {
      const assignee = await prisma.projectMember.findFirst({
        where: {
          projectId: task.projectId,
          accountId: payload.assigneeId,
        },
      });

      if (!assignee) {
        throw new AppError("Assignee must be in project", 400);
      }
    }
  }

  // 🔥 SECURITY FIX: whitelist fields (NO SPREAD)
  const data = {
    title: payload.title?.trim(),
    description: payload.description?.trim() || null,
    status: payload.status,
    priority: payload.priority,
    assigneeId:
      payload.assigneeId !== undefined ? payload.assigneeId : undefined,
  };

  if (payload.deadline !== undefined) {
    data.deadline = payload.deadline ? new Date(payload.deadline) : null;
  }

  return prisma.task.update({
    where: { id: taskId },
    data,
  });
};

/* =========================
   DELETE TASK
========================= */
export const deleteTask = async (taskId, userId) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  if (task.deletedAt) {
    return task; // idempotent
  }

  const member = await ensureProjectMember(task.projectId, userId);

  // 🔐 permission check
  canDeleteTask(member.role);

  return prisma.task.update({
    where: { id: taskId },
    data: {
      deletedAt: new Date(),
    },
  });
};

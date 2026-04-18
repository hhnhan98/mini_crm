import prisma from "../../config/prisma.js";
import { AppError } from "../../utils/AppError.js";

/**
 * Get project member role
 */
export const getProjectMember = async (projectId, userId) => {
  const member = await prisma.projectMember.findFirst({
    where: {
      projectId,
      accountId: userId,
    },
  });

  if (!member) {
    throw new AppError("Not a project member", 403);
  }

  return member;
};

/**
 * Check if user can update task
 */
export const canUpdateTask = (memberRole, task, userId) => {
  // OWNER / MANAGER full quyền
  if (memberRole === "OWNER" || memberRole === "MANAGER") return true;

  // ASSIGNEE chỉ được update task của chính mình
  if (task.assigneeId === userId) return true;

  throw new AppError("No permission to update task", 403);
};

/**
 * Check if user can delete task
 */
export const canDeleteTask = (memberRole) => {
  if (memberRole === "OWNER" || memberRole === "MANAGER") return true;

  throw new AppError("No permission to delete task", 403);
};

/**
 * Check if user can assign task
 */
export const canAssignTask = (memberRole) => {
  if (memberRole === "OWNER" || memberRole === "MANAGER") return true;

  throw new AppError("No permission to assign task", 403);
};

/**
 * Validate project membership (shortcut)
 */
export const ensureProjectMember = async (projectId, userId) => {
  return await getProjectMember(projectId, userId);
};

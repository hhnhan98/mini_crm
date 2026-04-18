import prisma from "../../config/prisma.js";

export const createTask = async (userId, payload) => {
  const { title, description, projectId, assigneeId, priority, deadline } =
    payload;

  // 1. Validate project tồn tại
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  // 2. Check user có thuộc project không
  const isMember = await prisma.projectMember.findFirst({
    where: {
      projectId,
      accountId: userId,
    },
  });

  if (!isMember) {
    throw new Error("You are not a member of this project");
  }

  // 3. Nếu có assignee → check thuộc project
  if (assigneeId) {
    const assignee = await prisma.projectMember.findFirst({
      where: {
        projectId,
        accountId: assigneeId,
      },
    });

    if (!assignee) {
      throw new Error("Assignee must be a project member");
    }
  }

  // 4. Create task
  const task = await prisma.task.create({
    data: {
      title: title.trim(),
      description: description?.trim(),
      projectId,
      assigneeId: assigneeId || null,
      priority,
      deadline: deadline ? new Date(deadline) : null,
      createdById: userId,
    },
  });

  return task;
};

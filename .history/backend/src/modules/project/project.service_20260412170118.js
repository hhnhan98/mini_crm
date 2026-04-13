import prisma from "../../config/prisma.js";

export const createProject = async ({ name, description, userId }) => {
  const project = await prisma.project.create({
    data: {
      name,
      description,
      createdBy: userId,
    },
  });

  // auto add owner as TEAMLEAD
  await prisma.projectMember.create({
    data: {
      projectId: project.id,
      accountId: userId,
      role: "TEAMLEAD",
    },
  });

  return project;
};

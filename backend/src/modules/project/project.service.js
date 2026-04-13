import prisma from "../../config/prisma.js";

// CREATE PROJECT
export const createProject = async ({ name, description, userId }) => {
  const project = await prisma.$transaction(async (tx) => {
    const newProject = await tx.project.create({
      data: {
        name,
        description,
        createdBy: userId,
      },
    });

    await tx.projectMember.create({
      data: {
        projectId: newProject.id,
        accountId: userId,
        role: "OWNER",
      },
    });

    return newProject;
  });

  return project;
};

// GET PROJECT DETAIL
export const getProjectDetail = async (projectId) => {
  return prisma.project.findUnique({
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
};

// GET MEMBER OF PROJECT
export const getMembers = async (projectId) => {
  return prisma.projectMember.findMany({
    where: {
      projectId,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      account: {
        select: {
          id: true,
          email: true,
          name: true,
          status: true,
        },
      },
    },
  });
};

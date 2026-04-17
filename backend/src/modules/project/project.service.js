import prisma from "../../config/prisma.js";

// CREATE PROJECT
export const createProject = async ({ name, description, userId }) => {
  return prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        name,
        description,
        creator: {
          connect: {
            id: userId,
          },
        },
      },
    });

    await tx.projectMember.create({
      data: {
        projectId: project.id,
        accountId: userId,
        role: "OWNER",
      },
    });

    return project;
  });
};

// GET MY PROJECTS
export const getMyProjects = async (userId) => {
  return prisma.projectMember.findMany({
    where: {
      accountId: userId,
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
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
      tasks: {
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
        },
        take: 10, // tránh nặng
      },
    },
  });
};

// GET MEMBERS (pagination)
export const getMembers = async (projectId, { page, limit }) => {
  const skip = (page - 1) * limit;

  return prisma.projectMember.findMany({
    where: {
      projectId,
    },
    skip,
    take: limit,
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

// ADD MEMBER
export const addMember = async ({ projectId, accountId, role }) => {
  // check user tồn tại
  const user = await prisma.account.findUnique({
    where: { id: accountId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // check đã là member chưa
  const existing = await prisma.projectMember.findFirst({
    where: {
      projectId,
      accountId,
    },
  });

  if (existing) {
    throw new Error("User already in project");
  }

  return prisma.projectMember.create({
    data: {
      projectId,
      accountId,
      role,
    },
  });
};

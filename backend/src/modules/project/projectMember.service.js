import prisma from "../../config/prisma.js";

/**
 * ===== CONSTANTS =====
 */
const ROLES = {
  OWNER: "OWNER",
  MANAGER: "MANAGER",
  MEMBER: "MEMBER",
};

const ADDABLE_ROLES = [ROLES.MEMBER, ROLES.MANAGER];

/**
 * ===== HELPER FUNCTIONS =====
 */

// Lấy member trong project
const getProjectMember = async (projectId, accountId) => {
  return prisma.projectMember.findUnique({
    where: {
      projectId_accountId: {
        projectId,
        accountId,
      },
    },
  });
};

// Check user tồn tại
const ensureUserExists = async (accountId) => {
  const user = await prisma.account.findUnique({
    where: { id: accountId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// Validate role hợp lệ khi add
const validateAddRole = (role) => {
  if (!ADDABLE_ROLES.includes(role)) {
    throw new Error("Invalid role");
  }
};

// Check quyền của current user
const ensureCanManageMembers = (currentMember, targetRole = null) => {
  if (!currentMember) {
    throw new Error("Access denied");
  }

  if (currentMember.role === ROLES.MEMBER) {
    throw new Error("Permission denied");
  }

  // MANAGER chỉ add MEMBER
  if (
    targetRole &&
    currentMember.role === ROLES.MANAGER &&
    targetRole !== ROLES.MEMBER
  ) {
    throw new Error("Manager can only manage MEMBER");
  }
};

/**
 * ===== MAIN SERVICES =====
 */

/**
 * Add member vào project
 */
export const addMember = async ({
  projectId,
  accountId,
  role,
  currentUser,
}) => {
  // 1. Validate role
  validateAddRole(role);

  // 2. Check user tồn tại
  await ensureUserExists(accountId);

  // 3. Check đã là member chưa
  const existingMember = await getProjectMember(projectId, accountId);
  if (existingMember) {
    throw new Error("User already in project");
  }

  // 4. Check quyền current user
  const currentMember = await getProjectMember(projectId, currentUser.id);

  ensureCanManageMembers(currentMember, role);

  // 5. Create member
  return prisma.projectMember.create({
    data: {
      projectId,
      accountId,
      role,
    },
  });
};

/**
 * Lấy danh sách member của project
 */
export const getMembers = async (projectId) => {
  return prisma.projectMember.findMany({
    where: { projectId },
    include: {
      account: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

/**
 * Update role của member
 */
export const updateMemberRole = async ({
  projectId,
  accountId,
  role,
  currentUser,
}) => {
  // 1. Validate role
  validateAddRole(role);

  // 2. Check member tồn tại
  const targetMember = await getProjectMember(projectId, accountId);

  if (!targetMember) {
    throw new Error("Member not found");
  }

  // 3. Không cho update OWNER
  if (targetMember.role === ROLES.OWNER) {
    throw new Error("Cannot update OWNER");
  }

  // 4. Check quyền current user
  const currentMember = await getProjectMember(projectId, currentUser.id);

  ensureCanManageMembers(currentMember, role);

  // 5. Update role
  return prisma.projectMember.update({
    where: {
      projectId_accountId: {
        projectId,
        accountId,
      },
    },
    data: {
      role,
    },
  });
};

/**
 * Remove member khỏi project
 */
export const removeMember = async ({ projectId, accountId, currentUser }) => {
  // 1. Check member tồn tại
  const targetMember = await getProjectMember(projectId, accountId);

  if (!targetMember) {
    throw new Error("Member not found");
  }

  // 2. Không cho xoá OWNER
  if (targetMember.role === ROLES.OWNER) {
    throw new Error("Cannot remove OWNER");
  }

  // 3. Không cho tự xoá mình (optional nhưng nên có)
  if (accountId === currentUser.id) {
    throw new Error("Cannot remove yourself");
  }

  // 4. Check quyền current user
  const currentMember = await getProjectMember(projectId, currentUser.id);

  ensureCanManageMembers(currentMember);

  // 5. Delete member
  return prisma.projectMember.delete({
    where: {
      projectId_accountId: {
        projectId,
        accountId,
      },
    },
  });
};

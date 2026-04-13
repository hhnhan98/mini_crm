import prisma from "../config/prisma.js";

// kiểm tra quyền truy cập vào dự án
export const checkProjectAccess = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;

    const member = await prisma.projectMember.findFirst({
      where: {
        projectId,
        accountId: userId,
      },
    });

    if (!member) {
      return res.status(403).json({
        message: "Access denied: not a project member",
      });
    }

    req.projectMember = member;
    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

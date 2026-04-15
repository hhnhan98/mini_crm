import prisma from "../config/prisma.js";

export const checkProjectRole = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { projectId } = req.params;

      // TODO: query DB kiểm tra role
      const member = await prisma.projectMember.findFirst({
        where: {
          projectId,
          accountId: userId,
        },
      });

      if (!member) {
        return res.status(403).json({
          message: "You are not in this project",
        });
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(member.role)) {
        return res.status(403).json({
          message: "Permission denied",
        });
      }

      req.projectRole = member.role;

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Check role failed",
      });
    }
  };
};

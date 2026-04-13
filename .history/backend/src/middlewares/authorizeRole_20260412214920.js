export const authorizeRole = (roles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }

      if (!Array.isArray(roles)) roles = [];

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Forbidden - insufficient permissions",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
      });
    }
  };
};

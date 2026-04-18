import express from "express";
import authRoutes from "./modules/auth/auth.route.js";
import projectRoutes from "./modules/project/project.route.js";
import taskRoutes from "./modules/task/task.route.js";

const app = express();

// parse JSON
app.use(express.json());

// health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server running",
  });
});

// ROUTES
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Not found",
  });
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    message: err.message || "Server error",
  });
});

export default app;

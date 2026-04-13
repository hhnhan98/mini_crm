import express from "express";
import authRoutes from "./modules/auth/auth.route.js";
const app = express();

app.use(express.json());
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("OK");
});

export default app;

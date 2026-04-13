import express from "express";
import authRoutes from "";
const app = express();

app.get("/", (req, res) => {
  res.send("OK");
});

export default app;

import express from "express";
import authRoutes from ".modules";
const app = express();

app.get("/", (req, res) => {
  res.send("OK");
});

export default app;

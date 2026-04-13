import express from "express";
import 
const app = express();

app.get("/", (req, res) => {
  res.send("OK");
});

export default app;

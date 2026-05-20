// server/server.js

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// fix __dirname cho ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// đường tới frontend
const frontendPath = path.join(__dirname, "../frontend/app");

// 1. serve static file
app.use(express.static(frontendPath));

// 2. SPA fallback (QUAN TRỌNG NHẤT)
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(3000, () => {
  console.log("Frontend server running at http://localhost:3000");
});
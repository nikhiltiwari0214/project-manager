const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

/* =========================
   SOCKET SETUP
========================= */
const io = new Server(server, {
  cors: {
    origin: "*", // change later to your frontend URL in production
  },
});

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* Attach io to all routes */
app.use((req, res, next) => {
  req.io = io;
  next();
});

/* =========================
   ROUTES
========================= */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/projects", require("./routes/projects"));

/* =========================
   SOCKET EVENTS
========================= */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("task-update", (data) => {
    io.emit("task-updated", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

/* =========================
   START SERVER (DEPLOY SAFE)
========================= */
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
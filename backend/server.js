const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const hrMangRoute = require("./routes/hr-manager-rt");
const authRoute = require("./routes/auth-rt");
const employeeRoute = require("./routes/employee-rt");
const managerRoute = require("./routes/manager-rt");
const http = require("http");
const employeeSocket = require("./socket-contorller/employee");
const HrSocket = require("./socket-contorller/hr-manager");
const managerSocket = require("./socket-contorller/manager");
const path = require("path");
require("dotenv").config();

const MONGODB_URI = process.env.MONGO_URI;

const PORT = process.env.PORT || 3000;

const app = express();

app.use("/result", express.static(path.join(__dirname, "result")));

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-auth-token"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use("/hr-manager", hrMangRoute);
app.use("/auth", authRoute);
app.use("/employee", employeeRoute);
app.use("/manager", managerRoute);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  res.status(status).json({ message });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`🚀 HTTP server running on port ${PORT}`);

      const io = require("./socket").init(server);
      employeeSocket(io);
      HrSocket(io);
      managerSocket(io);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

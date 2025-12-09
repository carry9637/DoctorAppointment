const express = require("express");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");
const net = require("net");
require("dotenv").config();
require("./db/conn");
require("./controllers/socket");
const userRouter = require("./routes/userRoutes");
const doctorRouter = require("./routes/doctorRoutes");
const appointRouter = require("./routes/appointRoutes");
const notificationRouter = require("./routes/notificationRouter");

const app = express();
let port = process.env.PORT || 5020;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3003",
      "http://localhost:3004",
      "https://doctor-appoinment-2025.netlify.app",
      "https://*.netlify.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/appointment", appointRouter);
app.use("/api/notification", notificationRouter);

// DEBUG ENDPOINT - Test applications
app.get("/api/debug/applications", async (req, res) => {
  try {
    const Doctor = require("./models/doctorModel");
    const User = require("./models/userModel");

    const allDoctors = await Doctor.find({}).populate("userId");
    const pendingDoctors = await Doctor.find({ isDoctor: false }).populate(
      "userId"
    );
    const approvedDoctors = await Doctor.find({ isDoctor: true }).populate(
      "userId"
    );

    console.log("Debug: All doctors count:", allDoctors.length);
    console.log("Debug: Pending applications:", pendingDoctors.length);
    console.log("Debug: Approved doctors:", approvedDoctors.length);

    res.json({
      summary: {
        totalDoctors: allDoctors.length,
        pendingApplications: pendingDoctors.length,
        approvedDoctors: approvedDoctors.length,
      },
      pending: pendingDoctors.map((d) => ({
        _id: d._id,
        userId: d.userId?._id,
        userName: `${d.userId?.firstname} ${d.userId?.lastname}`,
        email: d.userId?.email,
        specialization: d.specialization,
        experience: d.experience,
        fees: d.fees,
        isDoctor: d.isDoctor,
        createdAt: d.createdAt,
      })),
      approved: approvedDoctors.map((d) => ({
        _id: d._id,
        userId: d.userId?._id,
        userName: `${d.userId?.firstname} ${d.userId?.lastname}`,
        specialization: d.specialization,
      })),
    });
  } catch (error) {
    console.error("Debug endpoint error:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// Function to check if port is available
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", (err) => {
      if (err.code === "EADDRINUSE") {
        resolve(false);
      } else {
        resolve(false);
      }
    });
    server.once("listening", () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

// Function to find available port
async function findAvailablePort(startPort) {
  let currentPort = startPort;
  const maxAttempts = 10;
  let attempts = 0;

  while (attempts < maxAttempts) {
    if (await isPortAvailable(currentPort)) {
      return currentPort;
    }
    currentPort++;
    attempts++;
  }

  throw new Error(
    `No available port found in range ${startPort}-${startPort + maxAttempts}`
  );
}

// Start server with port fallback
findAvailablePort(port).then((availablePort) => {
  port = availablePort;
  const server = app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
    console.log(`📌 Make sure client is configured to connect to this port`);
  });

  // Graceful shutdown
  process.on("SIGTERM", () => {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });
  });

  process.on("SIGINT", () => {
    console.log("SIGINT signal received: closing HTTP server");
    server.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    server.close(() => {
      process.exit(1);
    });
  });
});

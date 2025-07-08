import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";


import authRoutes from "./routes/auth.js";
import seekerRoutes from "./routes/seeker.js";
import employerRoutes from "./routes/employer.js";
import jobRoutes from "./routes/job.js";
import applicationRoutes from "./routes/application.js";
import messageRoutes from "./routes/message.js";
import notificationRoutes from "./routes/notification.js";
import savedJobRoutes from "./routes/savedJob.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/api/application", applicationRoutes);
app.use("/uploads", express.static("uploads"));

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/seeker", seekerRoutes);
app.use("/api/employer", employerRoutes); // ✅ Make sure this is here
app.use("/api/jobs", jobRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/saved-jobs", savedJobRoutes);


const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB connection failed:", err));

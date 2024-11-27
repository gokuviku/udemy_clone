import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/db.js";

import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";
dotenv.config({});

// call database connection here
connectDB();
const app = express();

const PORT = process.env.PORT || 3000;

// default middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// apis
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/courseProgress", courseProgressRoute);

app.listen(PORT, () => {
  console.log(`Server listen at port ${PORT}`);
});

// WEBHOOK_ENDPOINT_SECRET=
// API_KEY=451755216331547
// API_SECRET=9mOAjmNmw_14ClmmQSVQCnPSx3s

// CLOUD_NAME=dgolytiri
// CLOUDINARY_URL=cloudinary://451755216331547:9mOAjmNmw_14ClmmQSVQCnPSx3s@dgolytiri

// MONGO_URI=mongodb://localhost:27017/Threads
// JWT_SECRET=fiywer87rc32rf382
// PORT=8000

// RAZORPAY_KEY_ID =
// RAZORPAY_KEY_SECRET =

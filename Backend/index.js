import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ConnectDB } from "./lib/DB.js";
import router from "./Routes/CompanyRoute.js";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
const allowedOrigins = [
  "http://localhost:5173",
  "https://creative-theards.vercel.app",
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// MongoDB Connection
ConnectDB()

//creating a route for the api
app.use("/api", router);



const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

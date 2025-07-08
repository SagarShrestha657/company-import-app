import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pokemonRouter from "./Routes/PokemonRoute.js";

dotenv.config();

const app = express();
app.use(express.json());
// app.use(express.urlencoded({ limit: "10mb", extended: true }));
const allowedOrigins = [
  "http://localhost:5173",
  "https://company-import-app.vercel.app",
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


app.use("/api", pokemonRouter);


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

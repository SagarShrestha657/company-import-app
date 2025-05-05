import express from "express";
import multer from "multer";
import { importHandler } from "../Controllers/CompanyController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/import", upload.single("file"), importHandler);

export default router;

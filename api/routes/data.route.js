import express from "express";
import { insertData, getDashboardStats, postDashboardStats, downloadLabData } from "../controllers/data.controller.js";
import middleware from "../utils/middleware.js";

const router = express.Router();

router.post("/insert", insertData);
router.get("/getDashboardStats", getDashboardStats);
router.post("/downloadLabData", downloadLabData);
router.post("/postDashboardStats", middleware.cleanEmptyArrays, postDashboardStats);


export { router as dataRouter };

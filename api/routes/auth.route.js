import express from "express";
import { createAccount, loginUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", createAccount);
router.post("/login", loginUser);

export { router as authRouter };

import { Router} from "express";
import upload from "../middleware/upload.js";
import {login, register} from "../controllers/auth_controller.js";

const router = Router();

// LOGIN
router.post("/login", login);


export default router;
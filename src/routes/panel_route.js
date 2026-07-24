import express from "express";

import { obtenerDashboard } from "../controllers/panel_controller.js";

import { auth } from "../middleware/auth_middleware.js";
import { authorizeRole } from "../middleware/authorizeRole.js";


const router = express.Router();


router.get(
    "/dashboard",
    auth,
    authorizeRole("admin", "gerente", "empleado"),
    obtenerDashboard
);


export default router;
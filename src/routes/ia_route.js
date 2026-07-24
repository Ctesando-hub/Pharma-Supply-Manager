import express from "express";

import { obtenerInteligencia } from "../controllers/ia_controller.js";

import { auth } from "../middleware/auth_middleware.js";
import { authorizeRole } from "../middleware/authorizeRole.js";

const router = express.Router();

//IA
router.get(
    "/",
    auth,
    authorizeRole("admin", "gerente"),
    obtenerInteligencia
);

export default router;
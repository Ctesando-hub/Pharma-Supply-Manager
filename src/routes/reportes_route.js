import express from "express";
import { obtenerResumenReporte } from "../controllers/reportes_controller.js";
import { auth } from "../middleware/auth_middleware.js";
import { authorizeRole } from "../middleware/authorizeRole.js";

const router = express.Router();

router.get(
    "/resumen",
    auth,
    authorizeRole("admin", "gerente"),
    obtenerResumenReporte
);

export default router;
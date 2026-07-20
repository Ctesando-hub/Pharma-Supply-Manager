import express from "express";
import {
    obtenerResumenReporte,
    obtenerVentasMensualesReporte,
    obtenerProductosMasVendidosReporte,
    obtenerStockCriticoReporte,
    obtenerClientesTopReporte
} from "../controllers/reportes_controller.js";

import { auth } from "../middleware/auth_middleware.js";
import { authorizeRole } from "../middleware/authorizeRole.js";

const router = express.Router();

// Resumen Ejecutivo
router.get(
    "/resumen",
    auth,
    authorizeRole("admin", "gerente"),
    obtenerResumenReporte
);


// Ventas Mensuales
router.get(
    "/ventas-mensuales",
    auth,
    authorizeRole("admin", "gerente"),
    obtenerVentasMensualesReporte
);

// Productos más vendidos
router.get(
    "/productos-mas-vendidos",
    auth,
    authorizeRole("admin", "gerente"),
    obtenerProductosMasVendidosReporte
);

// Stock Crítico
router.get(
    "/stock-critico",
    auth,
    authorizeRole("admin", "gerente"),
    obtenerStockCriticoReporte
);


// Clientes Top
router.get(
    "/clientes-top",
    auth,
    authorizeRole("admin", "gerente"),
    obtenerClientesTopReporte
);

export default router;
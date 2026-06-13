import express from "express"; //Importa el modulo Express para crear el servidor y definir rutas HTTP
import upload from "../middleware/upload.js";

const router = express.Router(); //crea un enrutador de express, que permite organizar las rutas en modulos separados.

import { getProductos, getProductoByID, searchProductos, crearProducto, actualizarProducto, eliminarProducto, getProductosFiltros } from "../controllers/productos_controller.js";
import {auth} from "../middleware/auth_middleware.js";
import { authorizeRole } from "../middleware/authorizeRole.js";

//-------------------
//Route GET - Devuelve todos los productos
//-------------------
router.get("/", auth, authorizeRole("admin", "gerente", "empleado"), getProductos);

//GET FILTROS
router.get("/filtros",auth, authorizeRole("admin", "gerente", "empleado"), getProductosFiltros);

// Ruta GET /search → busca productos por nombre
router.get("/search", auth, authorizeRole("admin", "gerente", "empleado"), searchProductos);

//GET ID (Usa el controlador)
router.get("/:id", auth, authorizeRole("admin", "gerente", "empleado"), getProductoByID);


//--------------------
//Route POST - Crear nuevo producto (usa el controlador)
//--------------------
router.post("/", auth, authorizeRole("admin", "gerente"), upload.fields([
        { name: "imagen", maxCount: 1 },
        { name: "prospecto", maxCount: 1 }
    ]),
    crearProducto
);

//-----------------
//Route PUT -Actualizar un producto
//-----------------

router.put("/:id", auth, authorizeRole("admin", "gerente"), upload.fields([
        { name: "imagen", maxCount: 1 },
        { name: "prospecto", maxCount: 1 }
    ]),actualizarProducto );

//-------------------
// Route PATCH
//------------------
router.patch("/:id/eliminar", auth, authorizeRole("admin"), eliminarProducto);

//-------------------
//Route DELETE
//-------------------

router.delete("/:id", auth, authorizeRole("admin"), eliminarProducto);



export default router; //exporta el router para poder usarlo en otros archivos, como en index.js.
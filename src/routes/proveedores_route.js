import express from "express"; //Importa el modulo Express para crear el servidor y definir rutas HTTP

const router = express.Router(); //crea un enrutador de express, que permite organizar las rutas en modulos separados.

import { getProveedores, getProveedorByID, searchProveedor, getProveedoresFiltros, crearProveedor,actualizarProveedor, eliminarProveedor } from "../controllers/proveedores_controller.js";

import { auth } from "../middleware/auth_middleware.js";

import { authorizeRole } from "../middleware/authorizeRole.js";

//-------------------
//Route GET - 
//-------------------

router.get("/", auth, authorizeRole("admin", "gerente", "empleado"), getProveedores); //Devuelve todos los proveedores

//GET FILTROS
router.get("/filtros", getProveedoresFiltros);

//GET serach
router.get("/search", auth, authorizeRole("admin", "gerente", "empleado"), searchProveedor);

//GET ID
router.get("/:id", auth, authorizeRole("admin", "gerente", "empleado"), getProveedorByID);

//--------------------
//Route POST -Crear nuevo proveedor
//--------------------

router.post("/", auth, authorizeRole("admin", "gerente"), crearProveedor);

//-----------------
//Route PUT -Actualizar un proveedor
//-----------------

router.put("/:id", auth, authorizeRole("admin", "gerente"), actualizarProveedor);


//-------------------
//Route DELETE
//-------------------

router.delete("/:id", auth, authorizeRole("admin"), eliminarProveedor);

//-------------------
//Route PATCH PARA BORRADO LOGICO
//-------------------

router.patch("/:id/eliminar", auth, authorizeRole("admin"), eliminarProveedor);


export default router; //exporta el router para poder usarlo en otros archivos, como en index.js.
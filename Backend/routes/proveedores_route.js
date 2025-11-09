import express from "express"; //Importa el modulo Express para crear el servidor y definir rutas HTTP

const router = express.Router(); //crea un enrutador de express, que permite organizar las rutas en modulos separados.

import { getProveedores, getProveedorByID, searchProveedor, crearProveedor,actualizarProveedor, eliminarProveedor } from "../controllers/proveedores_controller.js";


//-------------------
//Route GET - 
//-------------------

router.get("/", getProveedores); //Devuelve todos los proveedores

//GET serach
router.get("/search", searchProveedor);

//GET ID
router.get("/:id", getProveedorByID);

//--------------------
//Route POST -Crear nuevo proveedor
//--------------------

router.post("/", crearProveedor);

//-----------------
//Route PUT -Actualizar un proveedor
//-----------------

router.put("/:id", actualizarProveedor);


//-------------------
//Route DELETE
//-------------------

router.delete("/:id",eliminarProveedor);


export default router; //exporta el router para poder usarlo en otros archivos, como en index.js.
import express from "express"; //Importa el modulo Express para crear el servidor y definir rutas HTTP

const router = express.Router(); //crea un enrutador de express, que permite organizar las rutas en modulos separados.

import { getProductos, getProductoByID, searchProductos, crearProducto, actualizarProducto, eliminarProducto } from "../controllers/productos_controller.js";


//-------------------
//Route GET - Devuelve todos los productos
//-------------------
router.get("/", getProductos)

// Ruta GET /search → busca productos por nombre
router.get("/search", searchProductos);

//GET ID (Usa el controlador)
router.get("/:id",getProductoByID)


//--------------------
//Route POST - Crear nuevo producto (usa el controlador)
//--------------------
router.post("/", crearProducto);

//-----------------
//Route PUT -Actualizar un producto
//-----------------

router.put("/:id",actualizarProducto );


//-------------------
//Route DELETE
//-------------------

router.delete("/:id", eliminarProducto);




export default router; //exporta el router para poder usarlo en otros archivos, como en index.js.
import express from "express"; //Importa el modulo Express para crear el servidor y definir rutas HTTP

const router = express.Router(); //crea un enrutador de express, que permite organizar las rutas en modulos separados.

import { getProductos, getProductoByID,getProductoByName, crearProducto, actualizarProducto, eliminarProducto } from "../controllers/productos_controller.js";


//-------------------
//Route GET - Devuelve todos los productos
//-------------------
router.get("/", getProductos)



//GET ID (Usa el controlador)
router.get("/:id",getProductoByID)

//GET NAME (usa el controlador)

router.get("/:nombre",getProductoByName)


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
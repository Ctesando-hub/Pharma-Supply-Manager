import express from "express"; //Importa el modulo Express para crear el servidor y definir rutas HTTP

const router = express.Router(); //crea un enrutador de express, que permite organizar las rutas en modulos separados.

import { getProductos, getProductoByID, crearProducto, actualizarProducto, eliminarProducto } from "../controllers/productos_controller.js";

let productos = [
{ id: 1, nombre: "Paracetamol 500mg", laboratorio: "Bayer", precio: 120.0, stock: 50 },
{ id: 2, nombre: "Ibuprofeno 400mg", laboratorio: "Bagó", precio: 150.0, stock: 30 },
{ id: 3, nombre: "Amoxicilina 500mg", laboratorio: "Roemmers", precio: 200.0, stock: 20 },
];

//-------------------
//Route GET - Devuelve todos los productos
//-------------------
router.get("/", getProductos)



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
import express from "express"; //Importa el modulo Express para crear el servidor y definir rutas HTTP

const router = express.Router(); //crea un enrutador de express, que permite organizar las rutas en modulos separados.

import { actualizarStock, crearStock, eliminarStock, getStock, getStockByID, searchStock } from "../controllers/stock_controller.js";

//-------------------
//Route GET 
//-------------------

router.get("/", getStock); //- Devuelve lista de stock

//GET SEARCH -Busca Stock por producto

router.get("/search", searchStock);

//GET ID
router.get("/:id",getStockByID);


//--------------------
//Route POST -Crear nuevo stock
//--------------------

router.post("/",crearStock);

//-----------------
//Route PUT -Actualizar Stock
//-----------------

router.put("/:id", actualizarStock);


//-------------------
//Route DELETE
//-------------------

router.delete("/:id",eliminarStock);



export default router; //exporta el router para poder usarlo en otros archivos, como en index.js.
import express from "express"; //Importa el modulo Express para crear el servidor y definir rutas HTTP

const router = express.Router(); //crea un enrutador de express, que permite organizar las rutas en modulos separados.

import { actualizarStock, crearStock, eliminarStock, getStockProducto, getStock, getStockByID, getStockFiltros, searchStock } from "../controllers/stock_controller.js";

import { auth } from "../middleware/auth_middleware.js";
import { authorizeRole } from "../middleware/authorizeRole.js";

//-------------------
//Route GET 
//-------------------

router.get("/", auth, authorizeRole("admin", "gerente", "empleado"), getStock); //- Devuelve lista de stock

router.get("/filtros", auth, authorizeRole("admin", "gerente", "empleado"), getStockFiltros);

//GET SEARCH -Busca Stock por producto
router.get("/search", auth, authorizeRole("admin", "gerente", "empleado"), searchStock);

//GET ID
router.get("/:id", auth, authorizeRole("admin", "gerente", "empleado"), getStockByID);

//GET CANTIDAD PRODUCTOS
router.get("/producto/:id", auth, authorizeRole("admin", "gerente", "empleado"), getStockProducto);


//--------------------
//Route POST -Crear nuevo stock
//--------------------

router.post("/", auth, authorizeRole("admin", "gerente"), crearStock);

//-----------------
//Route PUT -Actualizar Stock
//-----------------

router.put("/:id", auth, authorizeRole("admin", "gerente"), actualizarStock);


//-------------------
//Route DELETE
//-------------------

router.delete("/:id", auth, authorizeRole("admin"),eliminarStock);



export default router; //exporta el router para poder usarlo en otros archivos, como en index.js.
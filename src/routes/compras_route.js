import express from "express"; //Importa el modulo Express para crear el servidor y definir rutas HTTP

const router = express.Router(); //crea un enrutador de express, que permite organizar las rutas en modulos separados.

import{getCompras, searchCompras, getCompraByID, crearCompras, actualizarCompra, eliminarCompra} from "../controllers/compras_controller.js";

import { auth } from "../middleware/auth_middleware.js";
import { authorizeRole } from "../middleware/authorizeRole.js";


//-------------------
//Route GET - Devuelve todas las compras
//-------------------

router.get("/", auth, authorizeRole("admin", "gerente", "empleado"), getCompras); //Devuelve todas las compras

// --------------------
// GET SEARCH - Buscar Compra por estado o cliente
// --------------------
router.get("/search", auth, authorizeRole("admin", "gerente", "empleado"), searchCompras);


//GET ID
router.get("/:id", auth, authorizeRole("admin", "gerente", "empleado"), getCompraByID);

//--------------------
//Route POST -Crear nueva compra
//--------------------

router.post("/", auth, authorizeRole("admin", "gerente"), crearCompras);


//-----------------
//Route PUT -Actualizar datos de un Pedido
//-----------------

router.put("/:id",auth, authorizeRole("admin", "gerente"), actualizarCompra);


//-------------------
//Route DELETE
//-------------------

router.delete("/:id", auth, authorizeRole("admin"),eliminarCompra);



export default router; //exporta el router para poder usarlo en otros archivos, como en index.js.
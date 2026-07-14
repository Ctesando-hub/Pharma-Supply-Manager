import express from "express"; //Importa el modulo Express para crear el servidor y definir rutas HTTP

const router = express.Router(); //crea un enrutador de express, que permite organizar las rutas en modulos separados.

import{getPedidos, searchPedidos, getDetallePedido, getPedidosByID, crearPedidos, actualizarPedido, eliminarPedido, getFiltroPedido} from "../controllers/pedidos_controller.js";

import { auth } from "../middleware/auth_middleware.js";
import { authorizeRole } from "../middleware/authorizeRole.js";


//-------------------
//Route GET - Devuelve todos los pedidos
//-------------------

router.get("/", auth, authorizeRole("admin", "gerente", "empleado"), getPedidos); //Devuelve todos los pedidos 

//------------------
// Route GET-FILTRO PEDIDO
//-------------------
router.get("/filtros", auth, authorizeRole("admin", "gerente", "empelado"), getFiltroPedido)

//------------------
//Route GET -Detalles Pedido
//------------------
router.get("/:id/detalle", auth, authorizeRole("admin", "gerente", "empleado"),getDetallePedido);

// --------------------
// GET SEARCH - Buscar pedidos por estado o cliente
// --------------------
router.get("/search", auth, authorizeRole("admin", "gerente", "empleado"), searchPedidos);


//GET ID
router.get("/:id", auth, authorizeRole("admin", "gerente", "empleado"), getPedidosByID);

//--------------------
//Route POST -Crear nuevo pedido
//--------------------

router.post("/", auth, authorizeRole("admin", "gerente", "empleado"), crearPedidos);


//-----------------
//Route PUT -Actualizar datos de un Pedido
//-----------------

router.put("/:id",auth, authorizeRole("admin", "gerente"), actualizarPedido);


//-------------------
//Route DELETE
//-------------------

router.delete("/:id", auth, authorizeRole("admin"),eliminarPedido);



export default router; //exporta el router para poder usarlo en otros archivos, como en index.js.
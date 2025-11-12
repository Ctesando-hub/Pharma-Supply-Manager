import express from "express"; //Importa el modulo Express para crear el servidor y definir rutas HTTP

const router = express.Router(); //crea un enrutador de express, que permite organizar las rutas en modulos separados.

import{getPedidos, searchPedidos, getPedidosByID, crearPedidos, actualizarPedido, eliminarPedido} from "../controllers/pedidos_controller.js";
//-------------------
//Route GET - Devuelve todos los pedidos
//-------------------

router.get("/",getPedidos); //Devuelve todos los pedidos 

// --------------------
// GET SEARCH - Buscar pedidos por estado o cliente
// --------------------
router.get("/search", searchPedidos);


//GET ID
router.get("/:id",getPedidosByID);

//--------------------
//Route POST -Crear nuevo pedido
//--------------------

router.post("/", crearPedidos);


//-----------------
//Route PUT -Actualizar datos de un Pedido
//-----------------

router.put("/:id", actualizarPedido);


//-------------------
//Route DELETE
//-------------------

router.delete("/:id",eliminarPedido);



export default router; //exporta el router para poder usarlo en otros archivos, como en index.js.
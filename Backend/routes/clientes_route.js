import express from "express"; //Importa el modulo Express para crear el servidor y definir rutas HTTP

const router = express.Router(); //crea un enrutador de express, que permite organizar las rutas en modulos separados.

import {crearCliente, getClientes, getClientesByID, searchClientes, actualizarCliente, eliminarCliente} from "../controllers/clientes_controller.js"


//-------------------
//Route GET - 
//-------------------

router.get("/", getClientes); //Devuelve todos los clientes

//GET SEARCH
router.get("/:nombre",searchClientes);

//GET ID
router.get("/:id", getClientesByID)


//--------------------
//Route POST -Crear nuevo ciente
//--------------------

router.post("/",crearCliente);


//-----------------
//Route PUT -Actualizar datos de un Cliente
//-----------------

router.put("/:id",actualizarCliente);


//-------------------
//Route DELETE
//-------------------

router.delete("/:id",eliminarCliente);





export default router; //exporta el router para poder usarlo en otros archivos, como en index.js.
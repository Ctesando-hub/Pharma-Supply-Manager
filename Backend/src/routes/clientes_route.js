import express from "express"; //Importa el modulo Express para crear el servidor y definir rutas HTTP

const router = express.Router(); //crea un enrutador de express, que permite organizar las rutas en modulos separados.

import {crearCliente, getClientes, getClientesByID, searchClientes, actualizarCliente, eliminarCliente} from "../controllers/clientes_controller.js"
import { auth } from "../middleware/auth_middleware.js";
import { authorizeRole } from "../middleware/authorizeRole.js";

//-------------------
//Route GET - 
//-------------------

router.get("/", auth, authorizeRole("admin", "gerente", "empleado"), getClientes); //Devuelve todos los clientes

//GET SEARCH
router.get("/search", auth, authorizeRole("admin", "gerente", "empleado"), searchClientes);

//GET ID
router.get("/:id", auth, authorizeRole("admin", "gerente", "empleado"), getClientesByID);


//--------------------
//Route POST -Crear nuevo ciente
//--------------------

router.post("/", auth, authorizeRole("admin", "gerente", "empleado"), crearCliente);


//-----------------
//Route PUT -Actualizar datos de un Cliente
//-----------------

router.put("/:id", auth, authorizeRole("admin", "gerente"), actualizarCliente);


//-------------------
//Route DELETE
//-------------------

router.delete("/:id", auth, authorizeRole("admin"), eliminarCliente);





export default router; //exporta el router para poder usarlo en otros archivos, como en index.js.
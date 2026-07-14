
import express from "express"; //Importa el modulo Express para crear el servidor y definir rutas HTTP

const router = express.Router(); //crea un enrutador de express, que permite organizar las rutas en modulos separados.


import { getProvincias, getProvinciasFiltros, searchProvincias, getProvinciaByID, crearProvincia, actualizarProvincia, eliminarProvincia  } from "../controllers/provincias_controller.js"
import { auth } from "../middleware/auth_middleware.js";
import { authorizeRole } from "../middleware/authorizeRole.js";

//-------------------
//Route GET - 
//-------------------

router.get("/", auth, authorizeRole("admin", "gerente", "empleado"), getProvincias); //Devuelve todos las provincias

router.get("/filtros", auth, authorizeRole("admin", "gerente", "empleado"), getProvinciasFiltros);

//GET SEARCH
router.get("/search", auth, authorizeRole("admin", "gerente", "empleado"), searchProvincias);

//GET ID
router.get("/:id", auth, authorizeRole("admin", "gerente", "empleado"), getProvinciaByID);


//--------------------
//Route POST -Crear nueva provincia
//--------------------

router.post("/", auth, authorizeRole("admin"), crearProvincia);


//-----------------
//Route PUT -Actualizar datos de una provincia
//-----------------

router.put("/:id", auth, authorizeRole("admin"), actualizarProvincia);



//-------------------
//Route PATCH PARA BORRADO LOGICO
//-------------------

router.patch("/:id/eliminar", auth, authorizeRole("admin"), eliminarProvincia);


export default router; //exporta el router para poder usarlo en otros archivos, como en index.js.
import express from "express"; //Importa el modulo Express para crear el servidor y definir rutas HTTP

const router = express.Router(); //crea un enrutador de express, que permite organizar las rutas en modulos separados.

import { actualizarCiudad, crearCiudad, eliminarCiudad, getCiudadByID, getCiudades, getCiudadesFiltros, searchCiudades } from "../controllers/ciudades_controller.js"
import { auth } from "../middleware/auth_middleware.js";
import { authorizeRole } from "../middleware/authorizeRole.js";

//-------------------
//Route GET - 
//-------------------

router.get("/", auth, authorizeRole("admin", "gerente", "empleado"), getCiudades); //Devuelve todos las ciudades

router.get("/filtros", auth, authorizeRole("admin", "gerente", "empleado"), getCiudadesFiltros);

//GET SEARCH
router.get("/search", auth, authorizeRole("admin", "gerente", "empleado"), searchCiudades);

//GET ID
router.get("/:id", auth, authorizeRole("admin", "gerente", "empleado"), getCiudadByID);


//--------------------
//Route POST -Crear nueva ciudad
//--------------------

router.post("/", auth, authorizeRole("admin"), crearCiudad);


//-----------------
//Route PUT -Actualizar datos de una ciudad
//-----------------

router.put("/:id", auth, authorizeRole("admin"), actualizarCiudad);



//-------------------
//Route PATCH PARA BORRADO LOGICO
//-------------------

router.patch("/:id/eliminar", auth, authorizeRole("admin"), eliminarCiudad);


export default router; //exporta el router para poder usarlo en otros archivos, como en index.js.
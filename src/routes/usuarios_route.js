import express from "express";


const router = express.Router();

import { actualizarUsuario, crearUsuario, eliminarUsuario, getUsuario, getUsuarioByID, searchUsuario, getUsuariosByRol, getUsuariosByEstado, getUsuariosFiltros } from "../controllers/usuario_controller.js";

import { auth } from "../middleware/auth_middleware.js";
import { authorizeRole } from "../middleware/authorizeRole.js";


//-------------------
//Route GET 
//-------------------

router.get("/", auth, authorizeRole("admin"), getUsuario); // -Obtener todos los usuarios

router.get("/filtros", getUsuariosFiltros);
// GET SEARCH -Obtener usuario por su nombre
router.get("/search", auth, authorizeRole("admin"), searchUsuario);

//GET BY ROL -Obtener usuario por el rol
router.get("/rol/:rol", getUsuariosByRol);

//GET ID -Obtener usuario por su ID
router.get("/:id", auth, authorizeRole("admin"), getUsuarioByID);

//GET ESTADO -Obtener usuario por estado
router.get("/estado/:estado", getUsuariosByEstado);



//--------------------
//Route POST -Crear nuevo Usuario
//--------------------
//auth, authorizeRole("admin"),
router.post("/", auth, authorizeRole("admin"), crearUsuario);

//-----------------
//Route PUT -Actualizar un usuario
//-----------------

router.put("/:id", auth, authorizeRole("admin"), actualizarUsuario);


//-------------------
//Route PATCH PARA BORRADO LOGICO
//-------------------

router.patch("/:id/eliminar", auth, authorizeRole("admin"), eliminarUsuario);


// -------------------------
// Exportación del router
// -------------------------
export default router;
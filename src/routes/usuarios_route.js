import express from "express";


const router = express.Router();

import { actualizarUsuario, crearUsuario, eliminarUsuario, getUsuario, getUsuarioByID, searchUsuario } from "../controllers/usuario_controller.js";

import { auth } from "../middleware/auth_middleware.js";
import { authorizeRole } from "../middleware/authorizeRole.js";


//-------------------
//Route GET 
//-------------------

router.get("/", auth, authorizeRole("admin"), getUsuario); // -Obtener todos los usuarios

// GET SEARCH -Obtener usuario por su nombre
router.get("/search", auth, authorizeRole("admin"), searchUsuario);


//GET ID -Obtener usuario por su ID
router.get("/:id", auth, authorizeRole("admin"), getUsuarioByID);



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
//Route DELETE
//-------------------

router.delete("/:id", auth, authorizeRole("admin"), eliminarUsuario);


// -------------------------
// Exportación del router
// -------------------------
export default router;
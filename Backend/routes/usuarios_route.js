import express from "express";


const router = express.Router();

import { actualizarUsuario, crearUsuario, eliminarUsuario, getUsuario, getUsuarioByID, searchUsuario } from "../controllers/usuario_controller.js";

//-------------------
//Route GET 
//-------------------

router.get("/", getUsuario); // -Obtener todos los usuarios

// GET SEARCH -Obtener usuario por su nombre
router.get("/search", searchUsuario);


//GET ID -Obtener usuario por su ID
router.get("/:id",getUsuarioByID);



//--------------------
//Route POST -Crear nuevo Usuario
//--------------------

router.post("/",crearUsuario);

//-----------------
//Route PUT -Actualizar un usuario
//-----------------

router.put("/:id", actualizarUsuario);


//-------------------
//Route DELETE
//-------------------

router.delete("/:id", eliminarUsuario);


// -------------------------
// Exportación del router
// -------------------------
export default router;
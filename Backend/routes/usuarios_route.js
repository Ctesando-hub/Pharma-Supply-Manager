import express from "express";


const router = express.Router();

let usuarios = [
    { id: 1, nombre: "Carolina Tesando", email: "caro@example.com", rol: "admin" },
    { id: 2, nombre: "Juan Pérez", email: "juanperez@example.com", rol: "empleado" },
    { id: 3, nombre: "Laura Gómez", email: "laura@example.com", rol: "visitador" }
];

//-------------------
//Route GET -Obtener todos los usuarios
//-------------------

router.get("/", (req, res) =>{
    res.json(usuarios);
})


//--------------------
//Router GET ID -Obtiene un usuario por su ID
//--------------------

router.get("/:id",(req,res)=>{
    const id = parseInt(req.params.id); // Extrae el parámetro "id" de la URL y lo convierte a número entero.
    const usuario = usuarios.find((p) => p.id === id); // Busca el usuario cuyo id coincida con el recibido.
    if (!usuario){
        return res.status(404).json({ mensaje: "Usuario no encontrado"});
    }
    res.json(usuario); // Si lo encuentra, envía el usuario en formato JSON.
});


//--------------------
//Route POST -Crear nuevo Usuario
//--------------------

router.post("/",(req,res)=>{
    const {nombre, email, rol} = req.body; // Extrae las propiedades del cuerpo (body) de la petición.

// Validar datos
    if (!nombre || !email || !rol) {
        return res.status(400).json({ mensaje: "Faltan datos del usuario" });// Si falta alguno, responde con error 400 (Bad Request).
    }
    const nuevoUsuario ={  // Crea un nuevo objeto usuario con un id incremental
        id: usuarios.length +1,
        nombre,
        email,
        rol
    };
    usuarios.push(nuevoUsuario);   // Agrega el nuevo usuario al array de usuarios existente.
    res.status(201).json({mensaje: "Usuario agregado correctamente", usuario: nuevoUsuario});// Devuelve una respuesta 201 (Created) con un mensaje y el usuario agregado.

});

//-----------------
//Route PUT -Actualizar un usuario
//-----------------

router.put("/:id", (req, res)=>{
    const id = parseInt(req.params.id); // Extrae el parámetro "id" de la URL y lo convierte a número entero.
    const index = usuarios.findIndex((p) => p.id === id);  
    
    if (index === -1){
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    const { nombre, email, rol} = req.body;
    usuarios[index] = { id, nombre, email, rol };
    res.json({ mensaje: "Usuario actualizado correctamente", usuario: usuarios[index] });
});


//-------------------
//Route DELETE
//-------------------

router.delete("/:id",(req,res)=> {
    const id = parseInt(req.params.id); // Extrae el parámetro "id" de la URL y lo convierte a número entero. 
    const index = usuarios.findIndex((p) => p.id === id); 
    if (index === -1) {
    return res.status(404).json({ mensaje: "Usuario no encontrado" });
    } 
    const usuarioEliminado = usuarios.splice(index, 1);
    res.json({ mensaje: "Usuario eliminado correctamente", usuario: usuarioEliminado })
});


// -------------------------
// Exportación del router
// -------------------------
export default router;
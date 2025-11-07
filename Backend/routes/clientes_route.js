import express from "express"; //Importa el modulo Express para crear el servidor y definir rutas HTTP

const router = express.Router(); //crea un enrutador de express, que permite organizar las rutas en modulos separados.

import {getClientes, getClientesByID, getClienteByName} from "../controllers/clientes_controller.js"

let clientes = [
    {
    id: 1,
    nombre: "Juan Pérez",
    email: "juan.perez@example.com",
    telefono: "351-4567890",
    direccion: "Av. Colón 1234, Córdoba",
    fechaRegistro: "2024-02-15"
    },
    {
    id: 2,
    nombre: "María López",
    email: "maria.lopez@example.com",
    telefono: "351-9876543",
    direccion: "Bv. San Juan 456, Córdoba",
    fechaRegistro: "2024-03-22"
    },
    {
    id: 3,
    nombre: "Carlos Rodríguez",
    email: "carlos.rodriguez@example.com",
    telefono: "3543-678912",
    direccion: "Rivadavia 789, Río Cuarto",
    fechaRegistro: "2024-05-10"
    },
    {
    id: 4,
    nombre: "Lucía Fernández",
    email: "lucia.fernandez@example.com",
    telefono: "351-1234567",
    direccion: "Sarmiento 250, Villa María",
    fechaRegistro: "2024-06-05"
    },
    {
    id: 5,
    nombre: "Pedro Gómez",
    email: "pedro.gomez@example.com",
    telefono: "358-3216549",
    direccion: "Belgrano 1020, Río Cuarto",
    fechaRegistro: "2024-07-18"
    }
];

//-------------------
//Route GET - 
//-------------------

router.get("/", getClientes); //Devuelve todos los clientes


//GET ID
router.get("/:id", getClientesByID)

//GET SEARCH
router.get("/:nombre", getClienteByName);



//--------------------
//Route POST -Crear nuevo ciente
//--------------------

router.post("/",(req,res)=>{
    const {nombre, email, telefono, direccion, fechaRegistro} = req.body; // Extrae las propiedades del cuerpo (body) de la petición.

// Validar datos
    if (!nombre || !email || !telefono || !direccion || !fechaRegistro) {
        return res.status(400).json({ mensaje: "Faltan datos del cliente" });// Si falta alguno, responde con error 400 (Bad Request).
    }
    const nuevoCliente ={  // Crea un nuevo objeto proveedor con un id incremental
        id: clientes.length +1,
        nombre,
        email,
        telefono,
        direccion,
        fechaRegistro
    };
    clientes.push(nuevoCliente);   // Agrega el nuevo Cliente al array de clientes existente
    res.status(201).json({mensaje: "Cliente agregado correctamente", cliente: nuevoCliente});// Devuelve una respuesta 201 (Created) con un mensaje y el nuevo cliente agregado.

});

//-----------------
//Route PUT -Actualizar datos de un Cliente
//-----------------

router.put("/:id", (req, res)=>{
    const id = parseInt(req.params.id); // Extrae el parámetro "id" de la URL y lo convierte a número entero.
    const index = clientes.findIndex((p) => p.id === id);  
    
    if (index === -1){
        return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }
    const { nombre, email, telefono, direccion, fechaRegistro } = req.body;
    clientes[index] = { id, nombre, email, telefono, direccion, fechaRegistro };
    res.json({ mensaje: "Cliente actualizado correctamente", cliente: clientes[index] });
});


//-------------------
//Route DELETE
//-------------------

router.delete("/:id",(req,res)=> {
    const id = parseInt(req.params.id); // Extrae el parámetro "id" de la URL y lo convierte a número entero. 
    const index = clientes.findIndex((p) => p.id === id); 
    if (index === -1) {
    return res.status(404).json({ mensaje: "Cliente no encontrado" });
    } 
    const clienteEliminado = clientes.splice(index, 1);
    res.json({ mensaje: "Cliente eliminado correctamente", cliente: clienteEliminado })
});






export default router; //exporta el router para poder usarlo en otros archivos, como en index.js.
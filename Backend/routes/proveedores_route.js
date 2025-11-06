import express from "express"; //Importa el modulo Express para crear el servidor y definir rutas HTTP

const router = express.Router(); //crea un enrutador de express, que permite organizar las rutas en modulos separados.

let proveedores = [
    {
    id: 1,
    nombre: "Laboratorios Bagó",
    cuit: "30-54678901-7",
    direccion: "Bernardo de Irigoyen 248, CABA",
    telefono: "011-4567-8901",
    email: "contacto@bago.com.ar",
    
    },
    {
    id: 2,
    nombre: "Roemmers S.A.I.C.F.",
    cuit: "30-58790123-4",
    direccion: "Calle Rivadavia 2450, CABA",
    telefono: "011-4785-2030",
    email: "info@roemmers.com.ar",
    
    },
    {
    id: 3,
    nombre: "Gador S.A.",
    cuit: "30-56780456-8",
    direccion: "Av. Córdoba 3672, Buenos Aires",
    telefono: "011-4958-2233",
    email: "ventas@gador.com.ar",
    
    },
    {
    id: 4,
    nombre: "Pfizer Argentina SRL",
    cuit: "30-67891234-9",
    direccion: "Av. Libertador 7202, Buenos Aires",
    telefono: "011-4789-7000",
    email: "atencion@pfizer.com.ar",
    
    },
    {
    id: 5,
    nombre: "Laboratorios Elea",
    cuit: "30-60789012-5",
    direccion: "Av. Del Libertador 498, Vicente López",
    telefono: "011-4711-2200",
    email: "clientes@elea.com.ar",
    
    }
];

//-------------------
//Route GET - Devuelve todos los proveedores
//-------------------

router.get("/", (req, res)=>{
        res.json(proveedores); 
});

//GET ID
router.get("/:id",(req,res)=>{
    const id = parseInt(req.params.id); // Extrae el parámetro "id" de la URL y lo convierte a número entero.
    const proveedor = proveedores.find((p) => p.id === id); // Busca el proveedor cuyo id coincida con el recibido.
    if (!proveedor){
        return res.status(404).json({ mensaje: "Proveedor no encontrado"});
    }
    res.json(proveedor); // Si lo encuentra, envía el proveedor en formato JSON.
});


//--------------------
//Route POST -Crear nuevo proveedor
//--------------------

router.post("/",(req,res)=>{
    const {nombre, cuit, direccion, telefono, email} = req.body; // Extrae las propiedades del cuerpo (body) de la petición.

// Validar datos
    if (!nombre || !cuit || !direccion || !telefono || !email) {
        return res.status(400).json({ mensaje: "Faltan datos del proveedor" });// Si falta alguno, responde con error 400 (Bad Request).
    }
    const nuevoproveedor ={  // Crea un nuevo objeto proveedor con un id incremental
        id: proveedores.length +1,
        nombre,
        cuit,
        direccion,
        telefono,
        email
    };
    proveedores.push(nuevoproveedor);   // Agrega el nuevo proveedor al array de proveedores existente
    res.status(201).json({mensaje: "Proveedor agregado correctamente", proveedor: nuevoproveedor});// Devuelve una respuesta 201 (Created) con un mensaje y el proveedor agregado

});

//-----------------
//Route PUT -Actualizar un proveedor
//-----------------

router.put("/:id", (req, res)=>{
    const id = parseInt(req.params.id); // Extrae el parámetro "id" de la URL y lo convierte a número entero.
    const index = proveedores.findIndex((p) => p.id === id);  
    
    if (index === -1){
        return res.status(404).json({ mensaje: "Proveedor no encontrado" });
    }
    const { nombre, cuit, direccion, telefono, email } = req.body;
    proveedores[index] = { id, nombre, cuit, direccion, telefono, email };
    res.json({ mensaje: "Proveedor actualizado correctamente", proveedor: proveedores[index] });
});


//-------------------
//Route DELETE
//-------------------

router.delete("/:id",(req,res)=> {
    const id = parseInt(req.params.id); // Extrae el parámetro "id" de la URL y lo convierte a número entero. 
    const index = proveedores.findIndex((p) => p.id === id); 
    if (index === -1) {
    return res.status(404).json({ mensaje: "proveedor no encontrado" });
    } 
    const proveedorEliminado = proveedores.splice(index, 1);
    res.json({ mensaje: "Proveedor eliminado correctamente", proveedor: proveedorEliminado })
});


export default router; //exporta el router para poder usarlo en otros archivos, como en index.js.
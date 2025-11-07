import express from "express"; //Importa el modulo Express para crear el servidor y definir rutas HTTP

const router = express.Router(); //crea un enrutador de express, que permite organizar las rutas en modulos separados.


let stock = [
    {
    id: 1,
    productoId: 1,
    sucursal: "Centro",
    cantidadDisponible: 50,
    minimoPermitido: 10,
    fechaActualizacion: "2025-11-01"
    },
    {
    id: 2,
    productoId: 2,
    sucursal: "Norte",
    cantidadDisponible: 30,
    minimoPermitido: 5,
    fechaActualizacion: "2025-11-02"
    },
    {
    id: 3,
    productoId: 3,
    sucursal: "Sur",
    cantidadDisponible: 80,
    minimoPermitido: 15,
    fechaActualizacion: "2025-11-03"
    },
    {
    id: 4,
    productoId: 4,
    sucursal: "Centro",
    cantidadDisponible: 120,
    minimoPermitido: 20,
    fechaActualizacion: "2025-11-04"
    },
    {
    id: 5,
    productoId: 5,
    sucursal: "Oeste",
    cantidadDisponible: 60,
    minimoPermitido: 10,
    fechaActualizacion: "2025-11-05"
    }
];



//-------------------
//Route GET - Devuelve lista de stock
//-------------------

router.get("/", (req, res)=>{
        res.json(stock); 
});

//GET ID
router.get("/:id",(req,res)=>{
    const id = parseInt(req.params.id); // Extrae el parámetro "id" de la URL y lo convierte a número entero.
    const stk = stock.find((p) => p.id === id); // Busca el cliente cuyo id coincida con el recibido.
    if (!stk){
        return res.status(404).json({ mensaje: "Stock no encontrado"});
    }
    res.json(stk); // Si lo encuentra, envía el cliente en formato JSON.
});


//--------------------
//Route POST -Crear nuevo stock
//--------------------

router.post("/",(req,res)=>{
    const {productoId, sucursal, cantidadDisponible, minimoPermitido, fechaActualizacion} = req.body; // Extrae las propiedades del cuerpo (body) de la petición.

// Validar datos
    if (!productoId || !sucursal || !cantidadDisponible || !minimoPermitido || !fechaActualizacion) {
        return res.status(400).json({ mensaje: "Faltan datos del Stock" });// Si falta alguno, responde con error 400 (Bad Request).
    }
    const nuevoStock ={  // Crea un nuevo objeto stock con un id incremental
        id: stock.length +1,
        productoId,
        sucursal,
        cantidadDisponible,
        minimoPermitido,
        fechaActualizacion
    };
    stock.push(nuevoStock);   // Agrega el nuevo Stock al array de stock existente
    res.status(201).json({mensaje: "Stock agregado correctamente", stk: nuevoStock});// Devuelve una respuesta 201 (Created) con un mensaje y el nuevo stock agregado.

});

//-----------------
//Route PUT -Actualizar Stock
//-----------------

router.put("/:id", (req, res)=>{
    const id = parseInt(req.params.id); // Extrae el parámetro "id" de la URL y lo convierte a número entero.
    const index = stock.findIndex((p) => p.id === id);  
    
    if (index === -1){
        return res.status(404).json({ mensaje: "Stock no encontrado" });
    }
    const { productoId, sucursal, cantidadDisponible, minimoPermitido, fechaActualizacion } = req.body;
    stock[index] = { id, productoId, sucursal, cantidadDisponible, minimoPermitido, fechaActualizacion };
    res.json({ mensaje: "Stock actualizado correctamente", stk: stock[index] });
});


//-------------------
//Route DELETE
//-------------------

router.delete("/:id",(req,res)=> {
    const id = parseInt(req.params.id); // Extrae el parámetro "id" de la URL y lo convierte a número entero. 
    const index = stock.findIndex((p) => p.id === id); 
    if (index === -1) {
    return res.status(404).json({ mensaje: "Stock no encontrado" });
    } 
    const stockEliminado = stock.splice(index, 1);
    res.json({ mensaje: "Stock eliminado correctamente", stk: stockEliminado })
});






export default router; //exporta el router para poder usarlo en otros archivos, como en index.js.
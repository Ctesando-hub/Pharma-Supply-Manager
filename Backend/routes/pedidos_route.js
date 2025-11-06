import express from "express"; //Importa el modulo Express para crear el servidor y definir rutas HTTP

const router = express.Router(); //crea un enrutador de express, que permite organizar las rutas en modulos separados.

let pedidos = [
    {
    id: 1,
    clienteId: 2,
    productos: [
        { idProducto: 1, cantidad: 2 },
        { idProducto: 4, cantidad: 1 }
    ],
    fecha: "2024-10-15",
    total: 15200,
    estado: "Pendiente"
    },
    {
    id: 2,
    clienteId: 4,
    productos: [
        { idProducto: 2, cantidad: 3 }
    ],
    fecha: "2024-10-18",
    total: 7200,
    estado: "En preparación"
    },
    {
    id: 3,
    clienteId: 1,
    productos: [
        { idProducto: 5, cantidad: 1 },
        { idProducto: 3, cantidad: 5 }
    ],
    fecha: "2024-11-01",
    total: 19450,
    estado: "Enviado"
    },
    {
    id: 4,
    clienteId: 3,
    productos: [
        { idProducto: 6, cantidad: 10 }
    ],
    fecha: "2024-11-03",
    total: 38500,
    estado: "Entregado"
    },
    {
    id: 5,
    clienteId: 5,
    productos: [
        { idProducto: 2, cantidad: 1 },
        { idProducto: 5, cantidad: 2 }
    ],
    fecha: "2024-11-05",
    total: 9100,
    estado: "Pendiente"
}
];
//-------------------
//Route GET - Devuelve todos los pedidos
//-------------------

router.get("/", (req, res)=>{
        res.json(pedidos); 
});

//GET ID
router.get("/:id",(req,res)=>{
    const id = parseInt(req.params.id); // Extrae el parámetro "id" de la URL y lo convierte a número entero.
    const pedido = pedidos.find((p) => p.id === id); // Busca el pedido cuyo id coincida con el recibido.
    if (!pedido){
        return res.status(404).json({ mensaje: "Pedido no encontrado"});
    }
    res.json(pedido); // Si lo encuentra, envía el pedido en formato JSON.
});


//--------------------
//Route POST -Crear nuevo pedido
//--------------------

router.post("/",(req,res)=>{
    const {clienteId, productos, fecha, total, estado} = req.body; // Extrae las propiedades del cuerpo (body) de la petición.

// Validar datos
    if (!clienteId || !productos || !fecha || !total|| !estado) {
        return res.status(400).json({ mensaje: "Faltan datos del Pedido" });// Si falta alguno, responde con error 400 (Bad Request).
    }
    const nuevoPedido ={  // Crea un nuevo objeto proveedor con un id incremental
        id: pedidos.length +1,
        clienteId,
        productos,
        fecha,
        total,
        estado
    };
    pedidos.push(nuevoPedido);   // Agrega el nuevo PEDIDO al array de pedidos existente
    res.status(201).json({mensaje: "Pedido agregado correctamente", pedido: nuevoPedido});// Devuelve una respuesta 201 (Created) con un mensaje y el nuevo pedido agregado.

});

//-----------------
//Route PUT -Actualizar datos de un Pedido
//-----------------

router.put("/:id", (req, res)=>{
    const id = parseInt(req.params.id); // Extrae el parámetro "id" de la URL y lo convierte a número entero.
    const index = pedidos.findIndex((p) => p.id === id);  
    
    if (index === -1){
        return res.status(404).json({ mensaje: "Pedido no encontrado" });
    }
    const { clienteId, productos, fecha, total, estado } = req.body;
    pedidos[index] = { id, clienteId, productos, fecha, total, estado };
    res.json({ mensaje: "Pedido actualizado correctamente", pedido: pedidos[index] });
});


//-------------------
//Route DELETE
//-------------------

router.delete("/:id",(req,res)=> {
    const id = parseInt(req.params.id); // Extrae el parámetro "id" de la URL y lo convierte a número entero. 
    const index = pedidos.findIndex((p) => p.id === id); 
    if (index === -1) {
    return res.status(404).json({ mensaje: "Pedido no encontrado" });
    } 
    const pedidoEliminado = pedidos.splice(index, 1);
    res.json({ mensaje: "Pedido eliminado correctamente", pedido: pedidoEliminado });
});






export default router; //exporta el router para poder usarlo en otros archivos, como en index.js.
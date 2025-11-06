import express from "express"; //Importa el modulo Express para crear el servidor y definir rutas HTTP

const router = express.Router(); //crea un enrutador de express, que permite organizar las rutas en modulos separados.

let productos = [
{ id: 1, nombre: "Paracetamol 500mg", laboratorio: "Bayer", precio: 120.0, stock: 50 },
{ id: 2, nombre: "Ibuprofeno 400mg", laboratorio: "Bagó", precio: 150.0, stock: 30 },
{ id: 3, nombre: "Amoxicilina 500mg", laboratorio: "Roemmers", precio: 200.0, stock: 20 },
];

//-------------------
//Route GET - Devuelve todos los productos
//-------------------

router.get("/", (req, res)=>{
        res.json(productos); 
});

//GET ID
router.get("/:id",(req,res)=>{
    const id = parseInt(req.params.id); // Extrae el parámetro "id" de la URL y lo convierte a número entero.
    const producto = productos.find((p) => p.id === id); // Busca el producto cuyo id coincida con el recibido.
    if (!producto){
        return res.status(404).json({ mensaje: "Producto no encontrado"});
    }
    res.json(producto); // Si lo encuentra, envía el producto en formato JSON.
});


//--------------------
//Route POST -Crear nuevo producto
//--------------------

router.post("/",(req,res)=>{
    const {nombre, laboratorio, precio, stock} = req.body; // Extrae las propiedades del cuerpo (body) de la petición.

// Validar datos
    if (!nombre || !laboratorio || !precio || !stock) {
        return res.status(400).json({ mensaje: "Faltan datos del producto" });// Si falta alguno, responde con error 400 (Bad Request).
    }
    const nuevoProducto ={  // Crea un nuevo objeto producto con un id incremental
        id: productos.length +1,
        nombre,
        laboratorio,
        precio,
        stock,
    };
    productos.push(nuevoProducto);   // Agrega el nuevo producto al array de productos existente
    res.status(201).json({mensaje: "Producto agregado correctamente", producto: nuevoProducto});// Devuelve una respuesta 201 (Created) con un mensaje y el producto agregado

});

//-----------------
//Route PUT -Actualizar un producto
//-----------------

router.put("/:id", (req, res)=>{
    const id = parseInt(req.params.id); // Extrae el parámetro "id" de la URL y lo convierte a número entero.
    const index = productos.findIndex((p) => p.id === id);  
    
    if (index === -1){
        return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    const { nombre, laboratorio, precio, stock } = req.body;
    productos[index] = { id, nombre, laboratorio, precio, stock };
    res.json({ mensaje: "Producto actualizado correctamente", producto: productos[index] });
});


//-------------------
//Route DELETE
//-------------------

router.delete("/:id",(req,res)=> {
    const id = parseInt(req.params.id); // Extrae el parámetro "id" de la URL y lo convierte a número entero. 
    const index = productos.findIndex((p) => p.id === id); 
    if (index === -1) {
    return res.status(404).json({ mensaje: "Producto no encontrado" });
    } 
    const productoEliminado = productos.splice(index, 1);
    res.json({ mensaje: "Producto eliminado correctamente", producto: productoEliminado })
});













export default router; //exporta el router para poder usarlo en otros archivos, como en index.js.
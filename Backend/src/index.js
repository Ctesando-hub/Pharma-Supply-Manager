import express from "express";  // Framework para crear el servidor y manejar rutas HTTP
import cors from "cors";        // Middleware que permite el acceso desde otros dominios (Frontend)
import dotenv from "dotenv";    // Permite manejar variables de entorno desde un archivo .env
import productosRouters from "./routes/productos_route.js";
import usuariosRouters from "./routes/usuarios_route.js";
import proveedoresRouters from "./routes/proveedores_route.js";
import clientesRouters from "./routes/clientes_route.js";
import pedidosRouters from "./routes/pedidos_route.js";
import stockRouters from "./routes/stock_route.js";


//  Configuramos dotenv para habilitar las variables de entorno
dotenv.config();

//  Creamos la instancia principal de la aplicación Express
const app = express();

//  Middlewares globales
app.use(cors());            // Habilita CORS (permite conexión con el frontend)
app.use(express.json());    // Permite recibir y procesar datos en formato JSON en las peticiones

//  Definimos el puerto de escucha del servidor
// Si existe una variable de entorno PORT, la usamos. Si no, usamos el puerto 3000.
const PORT = process.env.PORT || 3000;

//  Ruta principal de prueba (endpoint raíz)
// Sirve para comprobar que el servidor funciona correctamente.
app.get("/", (req, res) => {
res.send("Servidor Pharma Supply Manager funcionando correctamente");
});


//-------------------*
//       Rutas
//-------------------*

//productos

app.use("/api/productos", productosRouters); // Usa el router de productos con el prefijo /productos

//Usuarios
app.use("/api/usuarios", usuariosRouters); // usa el router de usuarios con el prefijo /usuarios

//Proveedores
app.use("/api/proveedores", proveedoresRouters); //usa el router de proveedores con el prefijo /proveedores

//Clientes
app.use("/api/clientes", clientesRouters); //usa el router de clientes con el prefijo /clientes

//Pedidos
app.use("/api/pedidos", pedidosRouters); //usa el router de clientes con el prefijo  /pedidos

//Stock
app.use("/api/stock", stockRouters); //usa el router de stock con el prefijo /stock



app.listen(PORT, () =>{
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});


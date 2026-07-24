import express from "express";  // Framework para crear el servidor y manejar rutas HTTP
import cors from "cors";        // Middleware que permite el acceso desde otros dominios (Frontend)
import dotenv from "dotenv";    // Permite manejar variables de entorno desde un archivo .env
import productosRouters from "./routes/productos_route.js";
import usuariosRouters from "./routes/usuarios_route.js";
import proveedoresRouters from "./routes/proveedores_route.js";
import clientesRouters from "./routes/clientes_route.js";
import pedidosRouters from "./routes/pedidos_route.js";
import stockRouters from "./routes/stock_route.js";
import compraRouters from "./routes/compras_route.js"
import authRouters from "./routes/auth.routes.js";
import ciudadesRouters from "./routes/ciudades_routes.js";
import provinciasRouters from "./routes/provincias_routes.js";
import reportesRoutes from "./routes/reportes_route.js";
import iaRouters from "./routes/ia_route.js";
import panelRoutes from "./routes/panel_route.js";

console.log("ESTE ES EL INDEX DEL BACKEND");

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

//Compras
app.use("/api/compras", compraRouters); //usa el router de compras con el prefijo /compras

//Ciudades
app.use("/api/ciudades", ciudadesRouters); //usa el router de ciudades con el prefijo /ciudades

//Provincia
app.use("/api/provincias", provinciasRouters); //usa el router de provincias con el prefijo /provincias

//auth
app.use("/api/auth", authRouters);

//reportes para fastapi
app.use("/api/reportes", reportesRoutes);

//IA
app.use("/api/ia", iaRouters);

//Panel
app.use("/api/panel", panelRoutes);



app.get("/", (req, res) => {
    res.send("Servidor Pharma Supply Manager funcionando correctamente");
});

app.listen(PORT, () =>{
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});


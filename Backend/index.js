 /*import http from 'http';



const server = http.createServer((request, response)=>{
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    console.log(request.method, response.url);
    response.end('ok');
});
const Port = 3000;
server.listen(Port, ()=>{
    console.log(`Servidor corriendo el puerto http://localhost:${Port}/`);
})*/
import express from "express";  // Framework para crear el servidor y manejar rutas HTTP
import cors from "cors";        // Middleware que permite el acceso desde otros dominios (Frontend)
import dotenv from "dotenv";    // Permite manejar variables de entorno desde un archivo .env

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

// ▶ Iniciamos el servidor
// Escucha las peticiones en el puerto indicado y muestra un mensaje en consola.
app.listen(PORT, () => {
console.log(`Servidor escuchando en el puerto ${PORT}`);
});
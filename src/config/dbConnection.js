
// ---------------------------------------------------------------------------
// Archivo: dbConnection.js
// Descripción: Establece conexión a MySQL para Pharma_Supply_Manager (local o Railway segun .env)
// ---------------------------------------------------------------------------

// Importamos el paquete mysql2 con soporte de promesas
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';// Importa dotenv para poder leer variables de entorno desde .env

dotenv.config(); // Carga las variables definidas en el archivo .env al process.env


// Objeto con la configuración de conexión a la base de datos
const dbSettings = {
  host: process.env.DB_HOST, // Host del servidor MySQL 
  user: process.env.DB_USER, // Usuario que se usa para conectarse a MySQL
  password: process.env.DB_PASSWORD || undefined,
  database: process.env.DB_NAME, // Nombre de la base de datos a la que se quiere conectar
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306, // Puerto de MySQL (si no está definido en .env, se usa el 3306 por defecto)
};

// Función para obtener la conexión
export async function getConnection() {
  try {
    console.log({
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT
});
    const connection = await mysql.createConnection(dbSettings);
    console.log("✅ Conectado correctamente a MySQL:", dbSettings.host);
    return connection;
  } catch (error) {
    console.error("❌ Error de conexión a MySQL:", error.message);
    throw error;
  }
}

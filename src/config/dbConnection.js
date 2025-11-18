
// ---------------------------------------------------------------------------
// Archivo: dbConnection.js
// Descripción: Establece conexión a MySQL para Pharma_Supply_Manager (local o Railway segun .env)
// ---------------------------------------------------------------------------

// Importamos el paquete mysql2 con soporte de promesas
import mysql from 'mysql2/promise';

// Configuración de la conexión usando variables del .env
const dbSettings = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

// Función para obtener la conexión
export async function getConnection() {
  try {
    const connection = await mysql.createConnection(dbSettings);
    console.log("✅ Conectado correctamente a MySQL:", dbSettings.host);
    return connection;
  } catch (error) {
    console.error("❌ Error de conexión a MySQL:", error.message);
    throw error;
  }
}

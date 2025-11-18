
// ---------------------------------------------------------------------------
// Archivo: dbConnection.js
// Descripción: Establece conexión a MySQL para Pharma_Supply_Manager (local o Railway segun .env)
// ---------------------------------------------------------------------------

// Importamos el paquete mysql2 con soporte de promesas
import mysql from 'mysql2/promise';


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

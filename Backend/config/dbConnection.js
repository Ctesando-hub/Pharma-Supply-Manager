
// ---------------------------------------------------------------------------
// Archivo: dbConnection.js
// Descripción: Establece conexión a MySQL para Pharma_Supply_Manager
// ---------------------------------------------------------------------------

// Importamos el paquete mysql2 con soporte de promesas
import mysql from 'mysql2/promise';

// Configuración de la conexión
const dbSettings = {
  host: 'localhost',            // Servidor local
  user: 'root',                 // Usuario de MySQL (por defecto root en XAMPP)
  password: '',                 // Contraseña (vacía si no la pusiste en XAMPP)
  database: 'Pharma_Supply_Manager', // Nombre exacto de tu base de datos
  port: 3306                    // Puerto de MySQL en XAMPP (por defecto 3306)
};

// Función para obtener la conexión
export async function getConnection() {
  try {
    const connection = await mysql.createConnection(dbSettings);
    console.log('✅ Conectado correctamente a la base de datos MySQL');
    return connection;
  } catch (error) {
    console.error('❌ Error de conexión a la base de datos MySQL:', error);
  }
}



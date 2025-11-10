// ============================================================================
// Archivo: test_db.js
// Descripción: Prueba la conexión a MySQL y una consulta simple
// ============================================================================

import { getConnection } from '../config/dbConnection.js';

async function testConnection() {
  const conn = await getConnection();

  if (conn) {
    try {
      const [rows] = await conn.execute('SELECT * FROM Proveedores LIMIT 5');
      console.log('📦 Resultado de la consulta:', rows);
      await conn.end(); // Cerramos la conexión
    } catch (queryError) {
      console.error('⚠️ Error al ejecutar la consulta:', queryError);
    }
  }
}

// Ejecutamos la función de prueba
testConnection();




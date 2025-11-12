import { getConnection } from "../config/dbConnection.js";

//Obtener todos los productos
export const getAllProductos =  async () =>{
const conn = await getConnection();
const [rows] = await conn.execute('SELECT *FROM Productos');
await conn.end();
return rows;
};

//Obtener producto por ID
export const getProductoByIDModel =  async (id) => {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT *FROM Productos WHERE id_producto = ?', [id]);
    await conn.end();
    return rows[0];
};

//Buscar productos por nombre
export const searchProductosModel = async (nombre) => {
    const conn = await getConnection();
    const [rows] =  await conn.execute( 'SELECT * FROM Productos WHERE LOWER(nombre) LIKE LOWER(?)',
        [`%${nombre}%`]);
    await conn.end();
    return rows;
};

// Crear un nuevo producto
export const crearProductoModel = async (producto) => {
    const { nombre, descripcion, precio, stock, id_proveedor } = producto;
    const conn = await getConnection();
    const [result] = await conn.execute(
        'INSERT INTO Productos (nombre, descripcion, precio, stock, id_proveedor) VALUES (?, ?, ?, ?, ?)',
        [nombre, descripcion, precio, stock, id_proveedor]
    );
    await conn.end();
    return { id: result.insertId, ...producto };
};

// Actualizar un producto existente
export const actualizarProductoModel = async (id, producto) => {
    const { nombre, descripcion, precio, stock, id_proveedor } = producto;
    const conn = await getConnection();
    await conn.execute(
        'UPDATE Productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, id_proveedor = ? WHERE id_producto = ?',
        [nombre, descripcion, precio, stock, id_proveedor, id]
    );
    await conn.end();
    return { id, ...producto };
};

// Eliminar un producto
export const eliminarProductoModel = async (id) => {
    const conn = await getConnection();
    await conn.execute('DELETE FROM Productos WHERE id_producto = ?', [id]);
    await conn.end();
    return { id };
};
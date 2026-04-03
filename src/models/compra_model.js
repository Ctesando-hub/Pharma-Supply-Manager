import { getConnection } from "../config/dbConnection.js";


// Obtener todas las compras
export const getAllComprasModel = async () => {
    const conn = await getConnection();
    try {
        const [rows] = await conn.execute(`
            SELECT 
            c.id_compra,
            c.fecha,
            c.total,
            pr.nombre AS proveedor,
            u.nombre AS usuario_HizoCompra,
            su.nombre AS sucursal,
            e.nombre_estado AS estado
            FROM compras c
            LEFT JOIN proveedor pr ON c.id_proveedor = pr.id_proveedor
            LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario
            LEFT JOIN sucursales su ON c.id_sucursal = su.id_sucursal
            LEFT JOIN estados_pedidos e ON c.id_estado = e.id_estado

        `);
        
        return rows;
    } catch (error) {
        console.error("Error al obtener Lista de Compras:", error.message);
        throw new Error("No se pudieron obtener la lista de Compras");
    } finally {
        await conn.end();
    }
};


// Obtener una compra por ID
export const getCompraByIDModel = async (id) => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(`
        SELECT
            c.id_compra,
            c.fecha,
            c.total,
            pr.nombre AS nombre_proveedor,
            u.nombre AS usuario_hizoCompra,
            su.nombre AS sucursal,
            e.nombre_estado AS estado
            FROM compras c
            LEFT JOIN proveedores pr ON c.id_proveedor = pr.proveedor
            LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario
            LEFT JOIN sucursales su ON c.id_sucursal = su.id_sucursal
            LEFT JOIN estados_pedido e ON c.id_estado = e.id_estado
            WHERE c.id_compra = ?`, [id]);

    if (rows.length === 0) {
        throw new Error("Compra no encontrada");
    }
    return rows[0];
    } catch (error) {
    console.error(`Error al obtener Compra con ID ${id}:`, error.message);
    throw new Error("No se pudo obtener la compra");
    } finally {
    await conn.end();
    }
};

// Buscar compra por nombre de proveedor
export const searchCompraModel = async (nombre) => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(`SELECT  
            c.id_compra,
            c.fecha,
            c.total,
            pr.nombre AS nombre_proveedor,
            u.nombre AS usuario_HizoCompra,
            su.nombre AS sucursal,
            e.nombre_estado AS estado
            FROM compras c
            LEFT JOIN proveedores cl ON c.id_proveedor = pr.id_proveedor
            LEFT JOIN usuarios u ON c.id_usuario = u.id_usuario
            LEFT JOIN sucursales su ON c.id_sucursal = su.id_sucursal
            LEFT JOIN estados_pedido e ON c.id_estado = e.id_estado
            WHERE LOWER(pr.nombre) LIKE LOWER(?)`, [`%${nombre}%`]);
    return rows;
    } catch (error) {
    console.error("Error al buscar Compra por nombre del proveedor:", error.message);
    throw new Error("No se pudieron buscar Compra al proveedor");
    } finally {
    await conn.end();
    }
};

// Crear nueva compra
export const crearCompraModel = async (compra) => {

    const {total, id_proveedor, id_usuario, id_sucursal, id_estado, productos} = compra;

    const conn = await getConnection();

    try {

        await conn.beginTransaction();

        // Crear compra
        const [result] = await conn.execute(
            `INSERT INTO compras
            (total, id_proveedor, id_usuario, id_sucursal, id_estado)
            VALUES (?, ?, ?, ?, ?)`,
            [total, id_proveedor, id_usuario, id_sucursal, id_estado]
        );

        const idCompra = result.insertId;

        // Insertar detalles
        for (const producto of productos){

            await conn.execute(
                `INSERT INTO detalle_compras
                (id_compra, id_producto, cantidad, precio_unitario)
                VALUES (?, ?, ?, ?)`,
                [
                    idCompra,
                    producto.id_producto,
                    producto.cantidad,
                    producto.precio_unitario
                ]
            );

        }

        await conn.commit();

        return { id_compra: idCompra };

    } catch (error){

        await conn.rollback();

        console.error("Error al crear compra:", error.message);
        throw new Error("No se pudo crear la compra");

    } finally {

        await conn.end();

    }

};

// Actualizar Compras
export const actualizarCompraModel = async (id, pedido) => { //export permite usar funcion en otros archivos, pedido es el objeto que viene del controller
    const {total, id_proveedor, id_usuario, id_sucursal, id_estado } = pedido; //destructuracion del pedido
    const conn = await getConnection(); //conexion con bd

    try {
        await conn.beginTransaction(); //todas las ejecuciones se tratan como una unidad
        
        //Obtener el estado de la compra actual
        const [compraActual] = await conn.execute(
            "SELECT id_estado FROM compras WHERE id_compra = ?", [id]
        );

        if (compraActual.length === 0) { //verificamos si existe la compra
            throw new Error("Compra no registrada");
        }

        const estadoActual = compraActual[0].id_estado; //usamos [0] porque usamos el 1er resultado de la bd

        //si el pedido pasa a completado
        if(id_estado === 3 && estadoActual !==3){ //para evitar sumar 2 veces el stock: si el nuevo estado es completado Y antes no estaba completado

            //obtener producto de la compra
            const [productos] = await conn.execute(
                "SELECT id_producto, cantidad FROM detalle_compras WHERE id_compra = ?", [id]
            );

            //Sumar el nuevo stock
            for (const producto of productos) { //recorremos cada producto de la compra completada
                await conn.execute(
                    `UPDATE stock
                    SET cantidad_disponible = cantidad_disponible + ? 
                    WHERE id_producto = ?`, // sumamos nuevos productos al stock
                    [producto.cantidad, producto.id_producto]
                    
                );
            }
        }

        //Actuallizar la compra
    const [result] = await conn.execute(
        "UPDATE compras SET total=?, id_proveedor=?, id_usuario=?, id_sucursal=?, id_estado=? WHERE id_compra=?",
        [total, id_proveedor, id_usuario, id_sucursal, id_estado, id]
    );
    if (result.affectedRows === 0) { //verifica si se actualizo
        throw new Error("Compra no encontrada");
    }
    await conn.commit(); //confirma los cambios
    return { id, ...pedido }; //devuelve la repuesta

    } catch (error) { //si algo falla manejamos errores

        await conn.rollback(); //Esto deshace todo lo que pasó dentro de la transacción
    console.error("Error al actualizar la compra:", error.message);
    throw new Error("No se pudo actualizar el la compra");

    } finally {
    await conn.end(); //Siempre cerramos la conexión a la base. Esto es muy importante para evitar fugas de conexiones
    }
};

// Eliminar una compra 
export const eliminarCompraModel = async (id) => {
    const conn = await getConnection();
    try {
    const [result] = await conn.execute(
        "DELETE FROM compras WHERE id_compra = ?",[id]);

            if (result.affectedRows === 0) {
        throw new Error("Compra no encontrada");
        }
    return { message: "Compra eliminada correctamente" };

    } catch (error) {
    console.error("Error al eliminar Compra:", error.message);
    throw new Error("No se pudo eliminar la compra");
    } finally {
    await conn.end();
    }
};
import { getConnection } from "../config/dbConnection.js";


// Obtener todos los productos
export const getAllPedidosModel = async () => {
    const conn = await getConnection();
    try {
        const [rows] = await conn.execute(`
            SELECT 
            pe.id_pedido,
            pe.fecha,
            pe.total,
            cl.nombre AS nombre_cliente,
            u.nombre AS usuario_tomoPedido,
            su.nombre AS sucursal,
            e.nombre_estado AS estado
            FROM pedidos pe
            LEFT JOIN clientes cl ON pe.id_cliente = cl.id_cliente
            LEFT JOIN usuarios u ON pe.id_usuario = u.id_usuario
            LEFT JOIN sucursales su ON pe.id_sucursal = su.id_sucursal
            LEFT JOIN estados_pedido e ON pe.id_estado = e.id_estado

        `);
        
        return rows;
    } catch (error) {
        console.error("Error al obtener Pedidos:", error.message);
        throw new Error("No se pudieron obtener los pedidos");
    } finally {
        await conn.end();
    }
};


// Obtener pedido por ID
export const getPedidoByIDModel = async (id) => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(`
        SELECT
            pe.id_pedido,
            pe.fecha,
            pe.total,
            cl.nombre AS nombre_cliente,
            u.nombre AS usuario_tomoPedido,
            su.nombre AS sucursal,
            e.nombre_estado AS estado
            FROM pedidos pe
            LEFT JOIN clientes cl ON pe.id_cliente = cl.id_cliente
            LEFT JOIN usuarios u ON pe.id_usuario = u.id_usuario
            LEFT JOIN sucursales su ON pe.id_sucursal = su.id_sucursal
            LEFT JOIN estados_pedido e ON pe.id_estado = e.id_estado
            WHERE pe.id_pedido = ?`, [id]);

    if (rows.length === 0) {
        throw new Error("Pedido no encontrado");
    }
    return rows[0];
    } catch (error) {
    console.error(`Error al obtener pedido con ID ${id}:`, error.message);
    throw new Error("No se pudo obtener el pedido");
    } finally {
    await conn.end();
    }
};

// Buscar pedido por nombre de cliente
export const searchPedidoModel = async (nombre) => {
    const conn = await getConnection();
    try {
    const [rows] = await conn.execute(`SELECT  
            pe.id_pedido,
            pe.fecha,
            pe.total,
            cl.nombre AS nombre_cliente,
            u.nombre AS usuario_tomoPedido,
            su.nombre AS sucursal,
            e.nombre_estado AS estado
            FROM pedidos pe
            LEFT JOIN clientes cl ON pe.id_cliente = cl.id_cliente
            LEFT JOIN usuarios u ON pe.id_usuario = u.id_usuario
            LEFT JOIN sucursales su ON pe.id_sucursal = su.id_sucursal
            LEFT JOIN estados_pedido e ON pe.id_estado = e.id_estado
            WHERE LOWER(cl.nombre) LIKE LOWER(?)`, [`%${nombre}%`]);
    return rows;
    } catch (error) {
    console.error("Error al buscar Pedido por nombre del cliente:", error.message);
    throw new Error("No se pudieron buscar pedido del cliente");
    } finally {
    await conn.end();
    }
};

// Crear un nuevo Pedido
export const crearPedidoModel = async (pedido) => {
    const {id_cliente, id_usuario, id_sucursal, id_estado, productos} = pedido;

    console.log("PEDIDO RECIBIDO EN MODEL:", pedido);
    console.log("PRODUCTOS EN MODEL:", productos);
    console.log("TIPO:", typeof productos);

    const conn = await getConnection();
    try {
        await conn.beginTransaction();

        let total = 0;

        //Guardar la informacion ya validada
        const productosProcesados  = [];

        //validar + traer precio + stock
        for (const producto of productos) {

            //  TRAER PRECIO DESDE BD
            const [productoDB] = await conn.execute(
                `SELECT precio FROM productos WHERE id_producto = ?`,
                [producto.id_producto]
            );

            if (productoDB.length === 0) {
                throw new Error("PRODUCTO_NO_EXISTE");
            }

            const precio_unitario = productoDB[0].precio;

        //verifica el stock de los productos
        const [stockActual] = await conn.execute(
                `SELECT cantidad_disponible FROM stock WHERE id_producto = ?`,
                [producto.id_producto]
            );
            
            if(stockActual[0].cantidad_disponible < producto.cantidad){
                throw new Error(`NO_HAY_STOCK`);
            }

            //calcular total real
            total += producto.cantidad * precio_unitario;
            productosProcesados.push({
                id_producto: producto.id_producto,
                cantidad: producto.cantidad,
                precio_unitario
            });

        }
        //Crear el pedido
    const [result] = await conn.execute(
        "INSERT INTO pedidos (total, id_cliente, id_usuario, id_sucursal, id_estado) VALUES (?, ?, ?, ?, ?)",
        [total, id_cliente, id_usuario, id_sucursal, id_estado]
    );
    const idPedido =  result.insertId;

    //Insertar productos en detalles_pedidos y descontar stock
    for( const producto of productosProcesados ){

        await conn.execute(
            `INSERT INTO detalles_pedidos
            (id_pedido, id_producto, cantidad, precio_unitario)
            VALUES(?, ? , ?, ?)`,
            [
                idPedido,
                producto.id_producto,
                producto.cantidad,
                producto.precio_unitario
            ]
        );

        await conn.execute(
            `UPDATE stock
            SET cantidad_disponible = cantidad_disponible - ?,
            cantidad_reservada = cantidad_reservada + ?
            WHERE id_producto = ?`,
            [
                producto.cantidad,
                producto.cantidad,
                producto.id_producto
            ]
        );
    }

    await conn.commit();
    return {id_pedido: idPedido};

    } catch (error) {
    
        await conn.rollback();

        if (error.message === "NO_HAY_STOCK"){
            throw new Error("No hay stock suficiente");
        }
        if(error.message === "PRODUCTO_NO_EXISTE"){
            throw new Error("Uno de los productos no existe");
        }

        console.error("Error al crear pedido:", error.message);
        throw new Error("No se pudo crear el pedido");

    } finally {
    await conn.end();
    }
};

// Actualizar producto
export const actualizarPedidoModel = async (id, pedido) => { //export permite usar funcion en otros archivos, pedido es el objeto que viene del controller
    const {id_cliente, id_usuario, id_sucursal, id_estado } = pedido; //destructuracion del pedido
    const conn = await getConnection(); //conexion con bd

    try {
        await conn.beginTransaction(); //todas las ejecuciones se tratan como una unidad
        
        //Obtener el estado del pedido actual
        const [pedidoActual] = await conn.execute(
            "SELECT id_estado FROM pedidos WHERE id_pedido = ?", [id]
        );

        if (pedidoActual.length === 0) { //verificamos si existe el pedido
            throw new Error("Pedido no encontrado");
        }

        const estadoActual = pedidoActual[0].id_estado; //usamos [0] porque usamos el1er resultado de la bd

        //si el pedido pasa a cancelado
        console.log("id_estado:", id_estado, typeof id_estado);
        console.log("estadoActual:", estadoActual, typeof estadoActual);
        if (Number(id_estado) === 4 && Number(estadoActual) !== 4){ //para evitar devolver 2 veces el stock: si el nuevo estado es cancelado Y antes no estaba cancelado

            //obtener producto del pedido
            const [productos] = await conn.execute(
                "SELECT id_producto, cantidad FROM detalles_pedidos WHERE id_pedido = ?", [id]
            );

            //Devolver el stock
            console.log("PRODUCTOS DEL PEDIDO:", productos);
            for (const producto of productos) { //recorremos cada producto del pedido
                const [resultStock] = await conn.execute(
            `UPDATE stock
            SET 
            cantidad_disponible = cantidad_disponible + ?,
            cantidad_reservada = GREATEST(cantidad_reservada - ?, 0)
                WHERE id_producto = ?`, [producto.cantidad, producto.cantidad, producto.id_producto]
);
        console.log("UPDATE STOCK:", {
        producto: producto.id_producto,
        affectedRows: resultStock.affectedRows
    });
        }
    
            }
    

        //Actuallizar el pedido
    const [result] = await conn.execute(
        "UPDATE pedidos SET id_cliente=?, id_usuario=?, id_sucursal=?, id_estado=? WHERE id_pedido=?",
        [id_cliente, id_usuario, id_sucursal, id_estado, id]
    );
    if (result.affectedRows === 0) { //verifica si se actualizo
        throw new Error("Pedido no encontrado");
    }
    await conn.commit(); //confirma los cambios
    return { id, ...pedido }; //devuelve la repuesta

    } catch (error) { //si algo falla manejamos errores

        await conn.rollback(); //Esto deshace todo lo que pasó dentro de la transacción
    console.error("Error al actualizar pedido:", error.message);
    throw new Error("No se pudo actualizar el pedido");

    } finally {
    await conn.end(); //Siempre cerramos la conexión a la base. Esto es muy importante para evitar fugas de conexiones
    }
};

// Eliminar un pedido
export const eliminarPedidoModel = async (id) => {
    const conn = await getConnection();
    try {
    const [result] = await conn.execute(
        "DELETE FROM pedidos WHERE id_pedido = ?",[id]);

            if (result.affectedRows === 0) {
        throw new Error("Producto no encontrado");
        }
    return { message: "Pedido eliminado correctamente" };

    } catch (error) {
    console.error("Error al eliminar pedido:", error.message);
    throw new Error("No se pudo eliminar el pedido");
    } finally {
    await conn.end();
    }
};
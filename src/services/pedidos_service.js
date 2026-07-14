import { getAllPedidosModel, getPedidoByIDModel, getPedidoFiltrosModel, getDetallePedidoModel, searchPedidoModel, crearPedidoModel, actualizarPedidoModel, eliminarPedidoModel } from "../models/pedidos_model.js";


export const getAllPedidosService = async () =>{
    return await getAllPedidosModel();
};

export const getDetallePedidoService = async (id) => {
    return await getDetallePedidoModel(id);
};

export const getPedidosFiltrosService = async (filtros) => {
    return await getPedidoFiltrosModel(filtros);
};

export const getPedidoByIDService = async (id) => {
    return await getPedidoByIDModel(id);
};

export const searchPedidoService = async (nombre) => {
    return await searchPedidoModel(nombre);
};

export const crearPedidosService = async (pedido) => {
    const {id_cliente, id_usuario, id_sucursal, productos} = pedido;

     // Validación de datos obligatorios
    if (!id_cliente || !id_usuario || !id_sucursal) {
        throw new Error("Faltan datos obligatorios");
    }

    if(!productos || !Array.isArray(productos)||productos.length === 0){
        throw new Error("El pedido debe tener al menos un producto");
    }
    let total = 0;
    for (const producto of productos){
        if(!producto.id_producto == null || !producto.cantidad == null){
            throw new Error("Producto invalido");
        }
          //  Validación lógica
        if (producto.cantidad <= 0) {
            throw new Error("La cantidad debe ser mayor a 0");
        }

        if (producto.precio_unitario < 0) {
            throw new Error("El precio no puede ser negativo");
        }
        total += producto.cantidad * producto.precio_unitario;
    }
    const id_estado = 1; //siempre sera pendiente 
    return await crearPedidoModel({
        total,
        id_cliente,
        id_usuario,
        id_sucursal,
        id_estado,
        productos
    });
};

export const actualizarPedidoService = async (id, pedido) => {
    return await actualizarPedidoModel(id, pedido);
};

export const eliminarPedidosService = async (id) => {
    return await eliminarPedidoModel(id);
};
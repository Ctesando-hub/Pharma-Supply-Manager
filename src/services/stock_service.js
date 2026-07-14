import { getAllStockModel, getStockByIDModel, getStockProductoModel, searchStockModel,getStockFiltrosModel, crearStockModel, actualizarStockModel, eliminarStockModel } from "../models/stock_model.js"; 


export const getAllStockService = async () => {

    const stocks = await getAllStockModel(); //obtenemos todos los stock que viene del model

    return stocks.map(s => { //recorre cada objeto  del arreglo

        let estado = "OK";

        // Producto recién creado
        if (s.cantidad_disponible === 0 && s.punto_reposicion === 0) {

            estado = "SIN CONFIGURAR";

        }

        // Producto sin unidades
        else if (s.cantidad_disponible === 0) {

            estado = "SIN STOCK";

        }

        // Stock crítico
        else if (s.cantidad_disponible <= s.punto_reposicion) {

            estado = "CRÍTICO";

        }

        // Cerca del punto de reposición
        else if (s.cantidad_disponible <= s.punto_reposicion * 1.5) {

            estado = "BAJO";

        }

        return {
            ...s, estado //copia todas las propiedades del objeto original
        };

    });

};

export const getStockByIDService = async (id) => {
    return await getStockByIDModel(id);
};

export const getStockProductoService = async (id) => {
    return await getStockProductoModel(id);
};

export const searchStockService = async (nombre) => {
    return await searchStockModel(nombre);
};
export const getStockFiltrosService = async ({
    nombre,
    estado
    }) => {

    let stocks = await getStockFiltrosModel({
        nombre
    });

    stocks = stocks.map(s => {
        let estadoCalculado = "OK";

        // Producto recién creado
        if (
            s.cantidad_disponible === 0 &&
            s.punto_reposicion === 0
        ) {

            estadoCalculado = "SIN CONFIGURAR";
        }

        // Sin unidades
        else if (
            s.cantidad_disponible === 0
        ) {

            estadoCalculado = "SIN STOCK";
        }

        // Crítico
        else if (
            s.cantidad_disponible <=
            s.punto_reposicion
        ) {

            estadoCalculado = "CRÍTICO";
        }

        // Cerca del límite
        else if (
            s.cantidad_disponible <=
            s.punto_reposicion * 1.5
        ) {

            estadoCalculado = "BAJO";
        }

        return {
            ...s,
            estado: estadoCalculado
        };
    });

    // filtro por estado
    if (estado) {
        stocks = stocks.filter(
            s => s.estado === estado);
    }
    return stocks;

};

export const crearStockService = async (id_producto) => {
    return await crearStockModel(id_producto);
};

export const actualizarStockService = async (id, stock) => {
    return await actualizarStockModel(id, stock);
};

export const eliminarStockService = async (id) => {
    return await eliminarStockModel(id);
};
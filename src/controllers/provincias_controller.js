import { getProvinciasService, getProvinciaByIDService, searchProvinciaService, crearProvinciaService, actualizarProvinciaService, eliminarProvinciaService } from "../services/provincias_service.js";
import logger from "../utils/logger.js";

// Controlador GET Traer todos las provincias
export const getProvincias = async (req, res) => {
    try{
        logger.info("GET /provincias - Solicitando lista de provincias");

        const provincias =  await getProvinciasService();
        logger.info(`GET /provincias - ${provincias.length} provincias encontradas`);

        res.status(200).json({ message: "Controlador funcionando: obteniendo toda la lista de Provincias", data: provincias});

    }catch (error) {
        logger.error(`GET /provincias - Error: ${error.message}`);
        res.status(500).json({ message: "Error al obtener lista de Provincias", error: error.message});
    }
};

//Controlador GET ID -Obtener una provincia especifica
export const getProvinciaByID = async (req,res) => {
    try{
        const {id} = req.params;
        logger.info(`GET /provincias/${id} - Buscando provincias`);
        const provincias = await getProvinciaByIDService(id);
        
          //validamos los datos
            if(!provincias) {
                return res.status(404).json({ message: "Provincia no encontrada"});
            }
                logger.info(`GET /provincias/${id} - Provincia encontrada`);
                return res.status(200).json({ message: "Provincia encontrada", data: provincias});

        } catch (error) {
            logger.error(`GET /provincias/${req.params.id} - Error: ${error.message}`);
            return res.status(500).json({ message: "Error al encontrar Provincia", error: error.message});
    }   
};

//Controller GET SEARCH Nombre
export const searchProvincias = async (req, res) =>{
    try{
        const {nombre} = req.query; // viene de ?nombre=
        logger.info(`GET /provincias/search?nombre=${nombre} - Buscando provincias por nombre`);

        if (!nombre) {
            logger.warn("GET /provincias/search - Falta parámetro nombre");
            return res.status(400).json({ message: "Debe proporcionar un parámetro de búsqueda (?nombre=...)" });
        }

        const provinciaBuscada = await searchProvinciaService(nombre);

        const resultados = provinciaBuscada.filter(pro =>
            pro.nombre.toLowerCase().includes(nombre.toLowerCase())
        );
        
        logger.info(`GET /provincias/search - ${resultados.length} resultados`);
        if (resultados.length === 0) {
            logger.warn("GET /provincias/search - No se encontraron provincias con ese nombre");
            return res.status(404).json({ message: "No se encontraron provincias con ese nombre" });
        }

        return res.status(200).json({ message: "Resultados de búsqueda", data: resultados });

    } catch(error){
        logger.error(`GET /provincias/search - Error: ${error.message}`);
        return res.status(500).json({ message: "Error al buscar provincia", error: error.message});
    }
};

// FILTROS COMBINADOS
export const getProvinciasFiltros = async (req, res) => {

    try {

        const { nombre } = req.query;

        const provincias = await getProvinciasFiltrosService({
            nombre
        });
        logger.info( `Resultados encontrados: ${provincias.length}`)
        return res.status(200).json({
            message: "Filtros aplicados correctamente",
            data: provincias
        });

    } catch (error) {

        console.error("Error filtros:", error);
        logger.error(`Error en getProvinciasFiltro: ${error.message}`);
        return res.status(500).json({
            message: "Error al filtrar provincias",
            error: error.message
        });
    }
};

//Controlador para crear un nueva provincia
export const crearProvincia = async (req, res) =>{
    try{
        logger.info("POST /provincias - Datos recibidos", req.body);
        const {nombre } = req.body; 

        // Validamos que nombre sea campo obligatorio
        if(!nombre){
            logger.warn("POST /provincias - Faltan datos obligatorios");
            return res.status(400).json({ message: "Faltan datos obligatorios"});
        }

        const nuevaProvincia = await crearProvinciaService(nombre);

        logger.info(`POST /provincias- Provincia creada ID: ${nuevaProvincia.id}`);
        res.status(201).json({ message: "Provincia creada correctamente", data: nuevaProvincia});       

    } catch (error){
        logger.error(`POST /provincias - Error: ${error.message}`);
        res.status(500).json({ message: "Error al crear la provincia", error: error.message});
    }
};

//Controlador para actualizar una provincia
export const actualizarProvincia =  async (req, res) => {
    try{
        const {id} =  req.params;
        const provincia =  req.body;
        logger.info(`PUT /provincias/${id} - Datos:`, req.body);

        const provinciaActualizada = await actualizarProvinciaService(id, provincia);

        logger.info(`PUT /provincias/${id} - Provincia Actualizada`);
        res.status(200).json({ message: "Provincia actualizada correctamente", data: provinciaActualizada});

    }catch(error){
        logger.error(`PUT /provincias/${req.params.id} - Error: ${error.message}`);
        res.status(500).json({ message: "Error al actualizar provincia", error: error.message});
    }

};

//Controlador para eliminar una provincia
export const eliminarProvincia=  async (req, res) =>{
    try{
        const {id} = req.params;
        logger.info(`DELETE /provincias/${id} - Eliminando provincia`);
        const provinciaEliminada = await eliminarProvinciaService(id);
    
        if (!provinciaEliminada){
            logger.warn(`DELETE /provincias/${id} - Provincia no encontrada`);
            return res.status(404).json({ message:"Provincia no encontrada"});
        }
        logger.info(`DELETE /provincias/${id} - Provincia eliminada`);
        res.status(200).json({ message: `Provincia con el ID: ${id} eliminada correctamente`});

    } catch (error){
        logger.error(`DELETE /provincias/${id} - Error: ${error.message}`);
        res.status(500).json({ message: "Error al eliminar provincia", error: error.message});
    }
};

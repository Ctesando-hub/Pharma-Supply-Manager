import {getCiudadesService, getCiudadByIDService, searchCiudadService, getCiudadesFiltrosService, crearCiudadService, actualizarCiudadService, eliminarCiudadService  } from "../services/ciudades_service.js";
import logger from "../utils/logger.js";

// Controlador GET Traer todos las ciudades
export const getCiudades = async (req, res) => {
    try{
        logger.info("GET /ciudades - Solicitando lista de ciudades");

        const ciudades =  await getCiudadesService();
        logger.info(`GET /ciudades - ${ciudades.length} ciudades encontradas`);

        res.status(200).json({ message: "Controlador funcionando: obteniendo toda la lista de Ciudades", data: ciudades});

    }catch (error) {
        logger.error(`GET /ciudades - Error: ${error.message}`);
        res.status(500).json({ message: "Error al obtener lista de Ciudades", error: error.message});
    }
};

//Controlador GET ID -Obtener una ciudad especifica
export const getCiudadByID = async (req,res) => {
    try{
        const {id} = req.params;
        logger.info(`GET /ciudades/${id} - Buscando ciudad`);
        const ciudades = await getCiudadByIDService(id);
        
          //validamos los datos
            if(!ciudades) {
                return res.status(404).json({ message: "Ciudad no encontrada"});
            }
                logger.info(`GET /ciudades/${id} - Ciudad encontrada`);
                return res.status(200).json({ message: "Ciudad encontrada", data: ciudades});

        } catch (error) {
            logger.error(`GET /ciudades/${req.params.id} - Error: ${error.message}`);
            return res.status(500).json({ message: "Error al encontrar Ciudad", error: error.message});
    }   
};

//Controller GET SEARCH Nombre
export const searchCiudades = async (req, res) =>{
    try{
        const {nombre} = req.query; // viene de ?nombre=
        logger.info(`GET /ciudades/search?nombre=${nombre} - Buscando ciudades por nombre`);

        if (!nombre) {
            logger.warn("GET /ciudades/search - Falta parámetro nombre");
            return res.status(400).json({ message: "Debe proporcionar un parámetro de búsqueda (?nombre=...)" });
        }

        const ciudadBuscada = await searchCiudadService(nombre);

        const resultados = ciudadBuscada.filter(ci =>
            ci.nombre.toLowerCase().includes(nombre.toLowerCase())
        );
        
        logger.info(`GET /ciudades/search - ${resultados.length} resultados`);
        if (resultados.length === 0) {
            logger.warn("GET /ciudades/search - No se encontraron ciudades con ese nombre");
            return res.status(404).json({ message: "No se encontraron ciudades con ese nombre" });
        }

        return res.status(200).json({ message: "Resultados de búsqueda", data: resultados });

    } catch(error){
        logger.error(`GET /ciudades/search - Error: ${error.message}`);
        return res.status(500).json({ message: "Error al buscar ciudad", error: error.message});
    }
};

// FILTROS COMBINADOS
export const getCiudadesFiltros = async (req, res) => {

    try {

        const { nombre, provincia  } = req.query;

        const ciudades = await getCiudadesFiltrosService({
            nombre, provincia
        });
        logger.info( `Resultados encontrados: ${ciudades.length}`)
        return res.status(200).json({
            message: "Filtros aplicados correctamente",
            data: ciudades
        });

    } catch (error) {

        console.error("Error filtros:", error);
        logger.error(`Error en getCiudadesFiltro: ${error.message}`);
        return res.status(500).json({
            message: "Error al filtrar ciudades",
            error: error.message
        });
    }
};

//Controlador para crear un nueva ciudad
export const crearCiudad = async (req, res) =>{
    try{
        logger.info("POST /ciudades - Datos recibidos", req.body);
        const { nombre, id_provincia} = req.body; //extraer los datos del body

        // Validamos que sean campos obligatorios
        if(!nombre || !id_provincia){
            logger.warn("POST /ciudades - Faltan datos obligatorios");
            return res.status(400).json({ message: "Faltan datos obligatorios"});
        }

        const nuevaCiudad = await crearCiudadService({nombre, id_provincia, });

        logger.info(`POST /ciudades - Ciudad creada ID: ${nuevaCiudad.id}`);
        res.status(201).json({ message: "Ciudad creada correctamente", data: nuevaCiudad});       

    } catch (error){
        logger.error(`POST /ciudades - Error: ${error.message}`);
        res.status(500).json({ message: "Error al crear la ciudad", error: error.message});
    }
};

//Controlador para actualizar una ciudad
export const actualizarCiudad =  async (req, res) => {
    try{
        const {id} =  req.params;
        const ciudad =  req.body;
        logger.info(`PUT /ciudades/${id} - Datos:`, req.body);

        const CiudadActualizada = await actualizarCiudadService(id, ciudad);

        logger.info(`PUT /ciudades/${id} - Ciudad Actualizada`);
        res.status(200).json({ message: "Ciudad actualizada correctamente", data: CiudadActualizada});

    }catch(error){
        logger.error(`PUT /ciudades/${req.params.id} - Error: ${error.message}`);
        res.status(500).json({ message: "Error al actualizar Ciudad", error: error.message});
    }

};

//Controlador para eliminar una ciudad
export const eliminarCiudad =  async (req, res) =>{
    try{
        const {id} = req.params;
        logger.info(`DELETE /ciudades/${id} - Eliminando ciudad`);
        const ciudadEliminada = await eliminarCiudadService(id);
    
        if (!ciudadEliminada){
            logger.warn(`DELETE /ciudades/${id} - Ciudad no encontrada`);
            return res.status(404).json({ message:"Ciudad no encontrada"});
        }
        logger.info(`DELETE /ciudades/${id} - Ciudad eliminada`);
        res.status(200).json({ message: `Ciudad con el ID: ${id} eliminada correctamente`});

    } catch (error){
        logger.error(`DELETE /ciudades/${id} - Error: ${error.message}`);
        res.status(500).json({ message: "Error al eliminar ciudad", error: error.message});
    }
};

import { getProveedoresService, getProveedorByIDService, searchProveedorService, crearProveedorService,
    actualizarProveedorService, eliminarProveedorService} from "../services/proveedores_service.js"; 



// Controlador GET Traer todos los proveedores

export const getProveedores = async (req, res) => {
    try{
        const proveedores = await getProveedoresService();
        res.status(200).json({ message: "Controlador funcionando: obteniendo toda la lista de Proveedores", data: proveedores});
    }catch (error) {
        res.status(500).json({ message: "Error al obtener lista de Proveedores", error: error.message});
    }
};


//Controlador GET ID -Obtener un cliente especifico
export const getProveedorByID = async (req,res) => {
    try{
        const {id} = req.params;
    
        const proveedores = await getProveedorByIDService(id);
            
           //validamos los datos
            if(!proveedores) {
                return res.status(404).json({ message: "Proveedor no encontrado"});
            }
                return res.status(200).json({ message: "Proveedor encontrado", data: proveedores});

        } catch (error) {
            return res.status(500).json({ message: "Error al encontrar Proveedor", error: error.message});
    }   
};

//Controller GET SEARCH 
export const searchProveedor = async (req, res) =>{
    try{
        const {nombre} = req.query; // viene de ?nombre=

        if (!nombre) {
            return res.status(400).json({ message: "Debe proporcionar un parámetro de búsqueda (?nombre=...)" });
        }

        const ProveedoresBuscados = await searchProveedorService(nombre);

        if (ProveedoresBuscados.length === 0) {
            return res.status(404).json({ message: "No se encontraron proveedores con ese nombre" });
        }

        return res.status(200).json({ message: "Resultados de búsqueda", data: ProveedoresBuscados });

    } catch(error){
        return res.status(500).json({ message: "Error al buscar proveedor", error: error.message});
    }
};

//Controlador para crear un nuevo proveedor
export const crearProveedor = async (req, res) =>{
    try{
        const { nombre, cuit, direccion, telefono, email, id_ciudad} = req.body; //extraer los datos del body

        // Validamos que sean campos obligatorios
        if(!nombre  ||!cuit ||!telefono ||!email ||!direccion ||!id_ciudad){
            return res.status(400).json({ message: "Faltan datos obligatorios"});
        }

        const nuevoProveedor = await crearProveedorService({nombre,cuit, direccion, telefono, email, id_ciudad});
            return res.status(201).json({ message: "Proveedor creado correctamente", data: nuevoProveedor});       

    } catch (error){
        res.status(500).json({ message: "Error al crear el proveedor", error: error.message});
    }
};

//Controlador para actualizar un cliente
export const actualizarProveedor =  async (req, res) => {
    try{
        const {id} =  req.params;
        const proveedor =  req.body;

        const proveedorActualizado =  await actualizarProveedorService(id, proveedor);

        //validamos los datos
        if (!proveedorActualizado){
            return res.status(400).json({message: "Faltan datos obligatorios"});
        }

        res.status(200).json({ message: "Proveedor simulado actualizado correctamente", data: proveedorActualizado});

    }catch(error){
        res.status(500).json({ message: "Error al actualizar Proveedor simulado", error: error.message});
    }

};

//Controlador para eliminar un proveedor

export const eliminarProveedor =  async (req, res) =>{
    try{
        const {id} = req.params;

        const proveedorElim = await eliminarProveedorService(id);

        if (!proveedorElim){
            return res.status(404).json({ message:"Proveedor no encontrado"});
        }
            res.status(200).json({ message: `Proveedor eliminado correctamente`});

    } catch (error){
        res.status(500).json({ message: "Error al eliminar el proveedor", error: error.message});
    }
};

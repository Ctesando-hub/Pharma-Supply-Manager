    import { alertSuccess, alertError, confirmDelete } from "./alerts.js"
    
    const token = localStorage.getItem("token"); // Obtiene el token de autenticación guardado en el navegador
    const rol = localStorage.getItem("rol"); // Obtiene el rol del usuario guardado en el navegador
    const nombre = localStorage.getItem("nombre"); //Obtiene el nombre del usuario y apellido
    const apellido = localStorage.getItem("apellido");
    const API_URL = "http://localhost:3000";
console.log("panel cargado");

document.addEventListener("DOMContentLoaded", () =>{ // Espera a que todo el HTML del documento esté cargado antes de ejecutar el JS
    //Seguridad basica del frontend
    if(!token ||!rol){ // si no existe token o rol, redirige al login 
        window.location.href = "login.html"; 
        return;
    }
    configurarPanel(rol);

    mostrarUsuario();

    registrarEventos();

    inicializarPasswordToggle();

});


function configurarPanel(rol){ // Configura el panel según el rol del usuario 
    console.log("ROL:", rol);

    switch (rol) {
        case "admin":
            configurarAdmin();
            break;

        case "empleado":
            configurarEmpleado();
            break;
            
        case "gerente":
            configurarGerente();
            break;
        default:
            cerrarSesion();  // Si el rol no coincide con ninguno, cierra sesión
            break;        
    }
};

   //PERMISOS
const permisos = { // Objeto que define qué módulos puede ver cada rol

    empleado: [
        "clientes",
        "productos",
        "pedidos",
        "ventas",
        "stock",
        "proveedores"
    ],

    gerente: [
        "clientes",
        "productos",
        "pedidos",
        "compras",
        "ventas",
        "stock",
        "proveedores",
        "sucursales"
        
    ],

    admin: [
        "usuarios",
        "clientes",
        "productos",
        "pedidos",
        "compras",
        "ventas",
        "proveedores",
        "stock",
        "sucursales",
        "ubicaciones",
        "ciudades",
        "provincias"
    ]
};

//PANEL ADMINISTRADOR

function configurarAdmin(){

    const rolElement = document.querySelector(".sidebar-user-role");

    if (rolElement) {
        rolElement.innerText = "Administrador";
    }

    document.querySelector(".user-box span.fw-bold")
    .innerText = "Administrador";

    aplicarPermisos(permisos.admin);
};


//Panel EMPLEADO
function configurarEmpleado() {
    

    document.querySelector(".manager-role").innerText = "EMPLEADO";
    document.querySelector(".user-box span.fw-bold").innerText = "Empleado";

    aplicarPermisos(permisos.empleado);
}

function configurarGerente(){
    document.querySelector(".manager-role").innerText = "GERENTE";
    document.querySelector(".user-box span.fw-bold").innerText = "Gerente";

    aplicarPermisos(permisos.gerente);
}

//FUNCION CENTRAL PERMISOS
function aplicarPermisos(modulosPermitidos){ // Oculta o muestra módulos según permisos del rol
       document.querySelectorAll("[data-module]").forEach(el => {  // Selecciona todos los elementos del menú
        const modulo = el.getAttribute("data-module");

        const permitido = modulosPermitidos.includes(modulo);
        
        if (!permitido){ // Si no está permitido, lo oculta
            el.style.display = "none";
        }
    });
}

//CERRAR SESION
function cerrarSesion(){// Elimina datos de sesión y redirige al login
    localStorage.removeItem("token");
    localStorage.removeItem("rol");

    window.location.href = "login.html";
}

// -*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-

function mostrarUsuario(){
    //Mostrar nombre y apellido del Usuario en el Panel
    document.querySelector(".user-box span.fw-bold")
    .innerText = `${nombre} ${apellido}`;

    //Iniciales avatar
    const iniciales =
    (nombre.charAt(0) || "") +
    (apellido.charAt(0) || "");

    document.querySelector(".user-avatar")
    .innerText = iniciales.toUpperCase();

}

//Mostrar seccion usuarios
function mostrarSeccion(seccion) {

    document.querySelectorAll(".module-section").forEach(s => {
        s.classList.add("d-none");
    });

    document.getElementById(seccion).classList.remove("d-none");
}

//MANEJAR MODULO
function manejarModulo(modulo) {

    switch (modulo) {

        case "usuarios":
            mostrarSeccion("usuariosSection");
            cargarUsuarios();
            break;

        case "clientes":
            mostrarSeccion("clientesSection");
            cargarClientes();
            break;

        case "productos":
            mostrarSeccion("productosSection");
            cargarProductos();
            cargarProveedoresSelect();
            break;

            case "proveedores":
            mostrarSeccion("proveedoresSection");
            cargarProveedores();
            
            break;

            case "stock":
            mostrarSeccion("stockSection");
            cargarStock();
            break;

            case "ubicaciones":
            console.log("Ubicaciones aún no implementado");
            break;

            case "transacciones":
            console.log("Transacciones aún no implementado");
            break;
    }
} 

function registrarEventos(){

    document.addEventListener("click", (e) => {
        // MODULOS (SIDEBAR + NAV)
        const moduloBtn = e.target.closest("[data-module]");
        if (moduloBtn) {
            e.preventDefault();

            const modulo = moduloBtn.getAttribute("data-module");
            manejarModulo(modulo);
        }

        //BOTON VOLVER
        if (e.target.closest(".btn-volver-panel")) {
            volverHomePanel();
        }

        // BOTON EDITAR USUARIO
        if (e.target.classList.contains("btn-editar")) {
            const id = e.target.dataset.id;
            editarUsuario(id);
        }
        // BOTON EDITAR CLIENTE
        if (e.target.classList.contains("btn-editarcl")) {
            const id = e.target.dataset.id;
            editarCliente(id);
        }
        // BOTON EDITAR PROVEEDOR
        if (e.target.classList.contains("btn-editarpr")) {
            const id = e.target.dataset.id;
            editarProveedor(id);
        }

        // BOTON EDITAR PRODUCTOS
        if (e.target.classList.contains("btn-editarpd")) {
            const id = e.target.dataset.id;
            editarProducto(id);
        }

        // BOTON EDITAR STOCK: cantidad y punto de reposicion
        if (e.target.classList.contains("btn-editarStock")) {
            const id = e.target.dataset.id;
            editarStock(id);
        }

        // BOTON ELIMINAR USUARIO
        if (e.target.classList.contains("btn-eliminar")) {
            const id = e.target.dataset.id;
            eliminarUsuario(id);
        }
         // BOTON ELIMINAR CLIENTE
        if (e.target.classList.contains("btn-eliminarcl")) {
            const id = e.target.dataset.id;
            eliminarCliente(id);
        }

          // BOTON ELIMINAR PROVEEDOR
        if (e.target.classList.contains("btn-eliminarpr")) {
            const id = e.target.dataset.id;
            eliminarProveedor(id);
        }

        //BOTON ELIMINAR PRODUCTO
        if (e.target.classList.contains("btn-eliminarpd")) {
            const id = e.target.dataset.id;
            eliminarProducto(id);
        }

        // NUEVO USUARIO
        if (e.target.id === "btnNuevoUsuario") {
            abrirModalNuevoUsuario();
        }

        // NUEVO CLIENTE -MODAL
        if (e.target.id === "btnNuevoCliente") {
            abrirModalNuevoCliente();
        }

         // NUEVO PROVEEDOR -MODAL
        if (e.target.id === "btnNuevoProveedores") {
            abrirModalNuevoProveedor();
        }

         // NUEVO PRODUCTO -MODAL
        if (e.target.id === "btnNuevoProductos") {
            abrirModalNuevoProducto();
        }

        // GUARDAR USUARIO
        if (e.target.id === "btnGuardarUsuario") {
            guardarUsuario();
        }

        //GUARDAR STOCK
        if (e.target.id === "btnGuardarStock") {
            guardarStock();
        }

        // GUARDAR CLIENTE
        if (e.target.id === "btnGuardarClientes") {
            guardarCliente();
        }

         // GUARDAR PROVEEDOR
        if (e.target.id === "btnGuardarProveedores") {
            guardarProveedor();
        }

         // GUARDAR PRODUCTO
        if (e.target.id === "btnGuardarProductos") {
            guardarProducto();
        }

        //GUARDAR STOCK
        if (e.target.id === "btnGuardarStock") {
            guardarStock();
        }

        // BUSCAR USUARIOS
        if (e.target.id === "btnBuscarUsuarios") {
            buscarUsuarios();
        }

        //BUSCAR CLIENTES
        if (e.target.id === "btnBuscarClientes") {
            buscarClientes();
        } 
        
        //BUSCAR PROVEEDORES
        if (e.target.id === "btnBuscarProveedores") {
            buscarProveedor();
        }  
        //BUSCAR PRODUCTOS
        if (e.target.id === "btnBuscarProductos") {
            buscarProducto();
        } 
         //BUSCAR PRODUCTOS POR STOCK
        if (e.target.id === "btnBuscarStock") {
            buscarProductoPorStock();
        } 
        
        // CLICK IMAGEN PRODUCTO
        if (e.target.classList.contains("img-producto-mini")) {

            const url = e.target.dataset.url;

            if (url) {
                window.open(url, "_blank");
            }
}

    });
}
// TRAER USUARIOS 
async function cargarUsuarios() {

    try {
        const res = await fetch(`${API_URL}/api/usuarios`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        console.log("USUARIOS:", data);

        const tbody = document.getElementById("tablaUsuarios");

        if (!tbody) return;

        tbody.innerHTML = "";

        data.data.forEach(u => {
            tbody.innerHTML += `
                <tr>
                    <td>${u.id_usuario}</td>
                    <td>${u.nombre} ${u.apellido}</td>
                    <td>${u.email}</td>
                    <td>${u.rol}</td>
                    <td>${u.sucursal}</td>
                    <td>${u.activo ? "Activo" : "Inactivo"}</td>
                    <td>
                        <button class="btn btn-sm btn-editar btneditar" data-id="${u.id_usuario}">Editar</button>
                        <button class="btn btn-sm btn-eliminar btneliminar" data-id="${u.id_usuario}">Eliminar</button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error cargando usuarios:", error);
    }
}

//SALIR DE SECCION 
function volverHomePanel() {

    // OCULTAR TODAS LAS SECCIONES
    document.querySelectorAll(".module-section").forEach(s => {
        s.classList.add("d-none");
    });

    // MOSTRAR DASHBOARD
    document.getElementById("dashboardSection")
        .classList.remove("d-none");
}

//FUNCION ELIMINAR USUARIOS
async function eliminarUsuario(id) {
    try{ // manejo de bloque 
        const confirmar = await confirmDelete("¿Seguro que querés eliminar este usuario?"); //muestra un poup del navegador con mensaje

        if (!confirmar.isConfirmed) return;
        const res = await fetch(`${API_URL}/api/usuarios/${id}/eliminar`, { //peticion al backend
            method: "PATCH",
            headers: { // cabecera HTTP, metaddata del la request
                "Content-Type": "application/json", //lo que se envia es json
                "Authorization": `Bearer ${token}` //envio del token (Bearer es el esquema de autenticacion y token esta guardado en el localStorage)
            }
        });
        const data = await res.json(); //convierte la repuesta del backend en un objeto JS

        if(!res.ok){ //si hay error muestra el mensaje
            await alertError(data.message || "Error al eliminar usuario");
            return; //corta la ejecucion si hubo error
        }

        await alertSuccess(data.message); //mensaje de exito

        //refrescar tabla
        cargarUsuarios();

    }catch (error){ //captura el error
        console.error("Error eliminando usuario:", error); //mensaje debbug
        await alertError("Error de conexión con el servidor");
    }
};

//FUNCION MOSTRAR FORMULARIO NUEVO USUARIO
function abrirModalNuevoUsuario() {

    // limpiar formulario
    limpiarFormulario();

    // ocultar estado
    document.getElementById("contenedorEstado").classList.add("d-none");
    document.getElementById("contenedorPassword").style.display = "block";

    // cambiar título
    document.querySelector("#usuarioModal .modal-title").innerText = "Nuevo Usuario";

    document.querySelector("#usuarioModal .modalIcon").className = "modalIcon bi bi-person-plus-fill icon-modal";

    // abrir modal
    const modal = new bootstrap.Modal(document.getElementById("usuarioModal"));
    modal.show();
}
 //FUNCION LIMPIAR FORMULARIO
function limpiarFormulario() {
    document.getElementById("usuarioId").value = "";
    document.getElementById("nombreu").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("rol").value = "1";
    document.getElementById("sucursal").value = "1";
    document.getElementById("activo").value = "1";
}
    //FUNCION OBTENER VALORES DEL FORMULARIO
function obtenerUsuarioFormulario() {
    return {
        nombre: document.getElementById("nombreu").value,
        apellido: document.getElementById("apellido").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        id_rol: document.getElementById("rol").value,
        id_sucursal: document.getElementById("sucursal").value,
        activo: 1
    };
}
async function guardarUsuario() {

    try {

        const id = document.getElementById("usuarioId").value;
        console.log("ID usuario:", id);

        const getValue = (idEl, fallback = "") => {
            const el = document.getElementById(idEl);
            return el ? el.value : fallback;
        };

        const activoEl = document.getElementById("activo");
        const password = document.getElementById("password").value;

        const usuario = {
            nombre: document.getElementById("nombreu").value,
            apellido: document.getElementById("apellido").value,
            email: document.getElementById("email").value,
            id_rol: document.getElementById("rol").value,
            id_sucursal: document.getElementById("sucursal").value,
            activo: document.getElementById("activo").value,
            

        };
            // password solo en crear usuario
            if (!id && password) {
                usuario.password = password;
            }

        const url = id
            ? `${API_URL}/api/usuarios/${id}`
            : `${API_URL}/api/usuarios`;

        const method = id ? "PUT" : "POST";
        console.log("USUARIO A ENVIAR:", usuario);
        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(usuario)
        });

        const data = await res.json();

        if (!res.ok) {
            await alertError(data.message || "Error al guardar usuario");
            return;
        }

        await  alertSuccess(id ? "Usuario actualizado" : "Usuario creado");

        cerrarModal();
        cargarUsuarios();

    } catch (error) {
        console.error(error);
        alert("Error de conexión");
    }
}
     //FUNCION EDITAR USUARIO
async function editarUsuario(id) {

    try {
        const res = await fetch(`${API_URL}/api/usuarios/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!res.ok || !data?.data) {
            await alertError(data.message || "Error al obtener usuario");
            return;
        }

        const u = data.data;

        // ID oculto
        document.getElementById("usuarioId").value = u.id_usuario;

        // Campos
        document.getElementById("nombreu").value = u.nombre || "";
        document.getElementById("apellido").value = u.apellido || "";
        document.getElementById("email").value = u.email || "";
        document.getElementById("contenedorPassword").style.display = "none";
        document.getElementById("rol").value = u.id_rol;
        document.getElementById("sucursal").value = u.id_sucursal;
        document.getElementById("activo").value = u.activo;
        document.getElementById("contenedorEstado").style.display = "block";// mostrar estado solo en edición
        
        // título dinámico
        document.querySelector("#usuarioModal .modal-title").innerText = "Editar Usuario";

        document.querySelector("#usuarioModal .modalIcon").className ="modalIcon bi bi-pencil-square icon-modal";

        // abrir modal
        const modalEl = document.getElementById("usuarioModal");
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();

    } catch (error) {
        console.error(error);
        await alertError("Error de conexión con el servidor");
    }
}
function cerrarModal() {

    const modalEl = document.getElementById("usuarioModal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    modal.hide();

    limpiarFormulario();
}

function inicializarPasswordToggle(){

    const toggle = document.getElementById("togglePassword");
    const input = document.getElementById("password");

    if(!toggle || !input) return;

    toggle.addEventListener("click", () => {

        if(input.type === "password"){
            input.type = "text";
        } else {
            input.type = "password";
        }

    });

}

async function buscarUsuarios() {

    try {

        const inputBusqueda = document.getElementById("inputBusquedaUsuario");
        const valorBusqueda = inputBusqueda.value.trim();

        const rol = document.getElementById("filtroRol").value;

        const estado = document.querySelector('input[name="estadoUsuario"]:checked').value;

        let response;

        //  BUSQUEDA POR ID (PRIORIDAD MAXIMA)
        if (valorBusqueda !== "" && !isNaN(valorBusqueda)) {

            response = await fetch(
                `${API_URL}/api/usuarios/${valorBusqueda}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

        }

        //  FILTROS COMBINADOS
        else {

            const params = new URLSearchParams();

            if (valorBusqueda !== "") {
                params.append("nombre", valorBusqueda);
            }

            if (rol !== "") {
                params.append("rol", rol);
            }

            if (estado !== "") {
                params.append("estado", estado);
            }

            response = await fetch(
                `${API_URL}/api/usuarios/filtros?${params.toString()}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
        }

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
        }

        const data = await response.json();

        const usuarios = Array.isArray(data.data)
            ? data.data
            : [data.data];

            if (usuarios.length === 0) {
                alertError("Sin resultados","No se encontraron usuarios con esos parámetros");
                 mostrarUsuarios([]); // limpia tabla
                return;
            }

        mostrarUsuarios(usuarios);

        // LIMPIAR
        inputBusqueda.value = "";
        document.getElementById("filtroRol").value = "";

        document.querySelector(
            'input[name="estadoUsuario"][value=""]'
        ).checked = true;

    } catch (error) {
        console.error(error);
        alertError("Error al buscar usuarios");
    }
}
function mostrarUsuarios(usuarios) {

    const tbody = document.getElementById("tablaUsuarios");

    if (!tbody) return;

    tbody.innerHTML = "";

    usuarios.forEach(u => {
        tbody.innerHTML += `
            <tr>
                <td>${u.id_usuario}</td>
                <td>${u.nombre} ${u.apellido}</td>
                <td>${u.email}</td>
                <td>${u.rol}</td>
                <td>${u.sucursal}</td>
                <td>${u.activo ? "Activo" : "Inactivo"}</td>
                <td>
                    <button class="btn btn-sm btn-editar btneditar" data-id="${u.id_usuario}">
                        Editar
                    </button>

                    <button class="btn btn-sm btn-eliminar btneliminar" data-id="${u.id_usuario}">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });

}
//-----------------CLIENTES--------------
// TRAER CLIENTES
async function cargarClientes() {

    try {
        const res = await fetch(`${API_URL}/api/clientes`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        console.log("CLIENTES:", data);

        const tbody = document.getElementById("tablaClientes");

        if (!tbody) return;

        tbody.innerHTML = "";

        data.data.forEach(cl => {
            tbody.innerHTML += `
                <tr>
                    <td>${cl.id_cliente}</td>
                    <td>${cl.nombre}</td>
                    <td>${cl.cuit}</td>
                    <td>${cl.telefono}</td>
                    <td>${cl.direccion}</td>
                    <td>${cl.email}</td>
                    <td>${cl.ciudad}</td>
                    <td>${cl.provincia}</td>
                    <td>${cl.tipo}</td>
                    
                    <td class="acciones">
                        <button class="btn btn-sm btn-editarcl btneditar" data-id="${cl.id_cliente}">Editar</button>
                        <button class="btn btn-sm btn-eliminarcl btneliminar" data-id="${cl.id_cliente}">Eliminar</button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error cargando clientes:", error);
    }
}

//FUNCION ELIMINAR CLIENTES
async function eliminarCliente(id) {
    try{ // manejo de bloque 
        const confirmar = await confirmDelete("¿Seguro que querés eliminar este cliente?"); //muestra un poup del navegador con mensaje

        if (!confirmar.isConfirmed) return;
        const res = await fetch(`${API_URL}/api/clientes/${id}/eliminar`, { //peticion al backend
            method: "PATCH",
            headers: { // cabecera HTTP, metaddata del la request
                "Content-Type": "application/json", //lo que se envia es json
                "Authorization": `Bearer ${token}` //envio del token (Bearer es el esquema de autenticacion y token esta guardado en el localStorage)
            }
        });
        const data = await res.json(); //convierte la repuesta del backend en un objeto JS

        if(!res.ok){ //si hay error muestra el mensaje
            await alertError(data.message || "Error al eliminar cliente");
            return; //corta la ejecucion si hubo error
        }

        await alertSuccess(data.message); //mensaje de exito

        //refrescar tabla
        cargarClientes();

    }catch (error){ //captura el error
        console.error("Error eliminando cliente:", error); //mensaje debbug
        await alertError("Error de conexión con el servidor");
    }
};

//FUNCION LIMPIAR FORMULARIO CLIENTE
function limpiarFormularioCli() {
    const ids = [
        "clienteId",
        "nombrecli",
        "cuit",
        "telefono",
        "direccion",
        "emailcli"
    ];

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });

    document.getElementById("ciudad").value = "1";
    document.getElementById("tipo").value = "1";
}

//FUNCION MOSTRAR FORMULARIO NUEVO CLIENTE
function abrirModalNuevoCliente() {

    // limpiar formulario
    limpiarFormularioCli();

    // cambiar título
    document.querySelector("#clienteModal .modal-title").innerText = "Nuevo Cliente";

    document.querySelector("#clienteModal .modalIcon").className = "modalIcon bi bi-person-plus-fill icon-modal";

    // abrir modal
    const modal = new bootstrap.Modal(document.getElementById("clienteModal"));
    modal.show();
}

function cerrarModalCli() {

    const modalEl = document.getElementById("clienteModal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    modal.hide();

    limpiarFormularioCli();
}
  //FUNCION OBTENER VALORES DEL FORMULARIO
function obtenerClienteFormulario() {
    return {
        nombre: document.getElementById("nombrecli").value,
        cuit: document.getElementById("cuit").value,
        telefono: document.getElementById("telefono").value,
        direccion: document.getElementById("direccion").value,
        email: document.getElementById("emailcli").value,
        id_ciudad: document.getElementById("ciudad").value,
        id_tipo: document.getElementById("tipo").value,

    };
}
async function guardarCliente() {

    try {

        const id = document.getElementById("clienteId").value;

        const cliente = obtenerClienteFormulario();

        const url = id
            ? `${API_URL}/api/clientes/${id}`
            : `${API_URL}/api/clientes`;

        const method = id ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(cliente)
        });

        const data = await res.json();

        if (!res.ok) {
            await alertError(data.message || "Error al guardar cliente");
            return;
        }

        await alertSuccess(id ? "Cliente actualizado" : "Cliente creado");

        cerrarModalCli();
        cargarClientes();

    } catch (error) {
        console.error(error);
        alert("Error de conexión");
    }
}
  //FUNCION EDITAR CLIENTE
async function editarCliente(id) {

    try {
        const res = await fetch(`${API_URL}/api/clientes/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!res.ok || !data?.data) {
            await alertError(data.message || "Error al obtener cliente");
            return;
        }

        const cl = data.data;

        // ID oculto
        document.getElementById("clienteId").value = cl.id_cliente;

        // Campos
        document.getElementById("nombrecli").value = cl.nombre || "";
        document.getElementById("cuit").value = cl.cuit || "";
        document.getElementById("telefono").value = cl.telefono || "";
        document.getElementById("direccion").value = cl.direccion || "";
        document.getElementById("emailcli").value = cl.email || "";
        document.getElementById("ciudad").value = cl.id_ciudad;
        document.getElementById("tipo").value = cl.id_tipo;
        
        // título dinámico
        document.querySelector("#clienteModal .modal-title").innerText = "Editar Cliente";

        document.querySelector("#clienteModal .modalIcon").className ="modalIcon bi bi-pencil-square icon-modal";

        // abrir modal
        const modalEl = document.getElementById("clienteModal");
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();

    } catch (error) {
        console.error(error);
        await alertError("Error de conexión con el servidor");
    }
}

//FUNCION BUSQUEDA FILTRO CLIENTE
async function buscarClientes() {

    try {

        const inputBusquedaCl = document.getElementById("inputBusquedaCliente");
        const valorBusquedaCl = inputBusquedaCl.value.trim();

        const ciudad = document.getElementById("filtroCiudad").value;
        const provincia = document.getElementById("filtroProvincia").value;
        const tipo = document.getElementById("filtroTipo").value;

        let response;

        //  BUSQUEDA POR ID (PRIORIDAD MAXIMA)
        if (valorBusquedaCl !== "" && !isNaN(valorBusquedaCl)) {

            response = await fetch(
                `${API_URL}/api/clientes/${valorBusquedaCl}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

        }

        //  FILTROS COMBINADOS
        else {

            const params = new URLSearchParams();

            if (valorBusquedaCl !== "") {
                params.append("nombre", valorBusquedaCl);
            }

            if (ciudad !== "") {
                params.append("ciudad", ciudad);
            }

            if (provincia !== "") {
                params.append("provincia", provincia);
            }

            if(tipo !== ""){
                params.append("tipo", tipo);
            }

            response = await fetch(
                `${API_URL}/api/clientes/filtros?${params.toString()}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
        }

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
        }

        const data = await response.json();

        const clientes = Array.isArray(data.data)
            ? data.data
            : [data.data];

            if (clientes.length === 0) {
                alertError("Sin resultados","No se encontraron clientes con esos parámetros");
                 mostrarClientes([]); // limpia tabla
                return;
            }

        mostrarClientes(clientes);

        // LIMPIAR
        inputBusquedaCl.value = "";
        document.getElementById("filtroCiudad").value = "";
        document.getElementById("filtroProvincia").value = "";
        document.getElementById("filtroTipo").value = "";   

    } catch (error) {
        console.error(error);
        alertError("Error al buscar clientes");
    }
}
function mostrarClientes(clientes) {

    const tbody = document.getElementById("tablaClientes");

    if (!tbody) return;

    tbody.innerHTML = "";

    clientes.forEach(cl => {
        tbody.innerHTML += `
            <tr>
                <td>${cl.id_cliente}</td>
                <td>${cl.nombre}</td>
                <td>${cl.cuit}</td>
                <td>${cl.telefono}</td> 
                <td>${cl.direccion}</td>
                <td>${cl.email}</td>
                <td>${cl.ciudad}</td>
                <td>${cl.provincia}</td>
                <td>${cl.tipo}</td>
                <td>
                    <button class="btn btn-sm btn-editarcl btneditar" data-id="${cl.id_cliente}">
                        Editar
                    </button>

                    <button class="btn btn-sm btn-eliminarcl btneliminar" data-id="${cl.id_cliente}">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });

}

//--------------PROVEEDORES--------------
// TRAER PROVEEDORES
async function cargarProveedores() {

    try {
        const res = await fetch(`${API_URL}/api/proveedores`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        console.log("PROVEEDORES:", data);

        const tbody = document.getElementById("tablaProveedores");

        if (!tbody) return;

        tbody.innerHTML = "";

        data.data.forEach(pr => {
            tbody.innerHTML += `
                <tr>
                    <td>${pr.id_proveedor}</td>
                    <td>${pr.nombre}</td>
                    <td>${pr.telefono}</td>
                    <td>${pr.email}</td>
                    <td>${pr.direccion}</td>
                    <td>${pr.ciudad}</td>
                    <td>${pr.provincia}</td>
    
                    <td class="acciones">
                        <button class="btn btn-sm btn-editarpr btneditar" data-id="${pr.id_proveedor}">Editar</button>
                        <button class="btn btn-sm btn-eliminarpr btneliminar" data-id="${pr.id_proveedor}">Eliminar</button>
                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error cargando proveedor:", error);
    }
}

//FUNCION ELIMINAR PROVEEDOR
async function eliminarProveedor(id) {

    try{ // manejo de bloque 
        const confirmar = await confirmDelete("¿Seguro que querés eliminar este proveedor?"); //muestra un poup del navegador con mensaje

        if (!confirmar.isConfirmed) return;
        const res = await fetch(`${API_URL}/api/proveedores/${id}/eliminar`, { //peticion al backend
            method: "PATCH",
            headers: { // cabecera HTTP, metaddata del la request
                "Content-Type": "application/json", //lo que se envia es json
                "Authorization": `Bearer ${token}` //envio del token (Bearer es el esquema de autenticacion y token esta guardado en el localStorage)
            }
        });
        const data = await res.json(); //convierte la repuesta del backend en un objeto JS

        if(!res.ok){ //si hay error muestra el mensaje
            await alertError(data.message || "Error al eliminar proveedor");
            return; //corta la ejecucion si hubo error
        }

        await alertSuccess(data.message); //mensaje de exito

        //refrescar tabla
        cargarProveedores();

    }catch (error){ //captura el error
        console.error("Error eliminando proveedor:", error); //mensaje debbug
        await alertError("Error de conexión con el servidor");
    }
};

//FUNCION LIMPIAR FORMULARIO PROVEEDOR
function limpiarFormularioPr() {
    const ids = [
        "proveedorId",
        "nombrepr",
        "telefonopr",
        "emailpr",
        "direccionpr",

    ];

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });

    document.getElementById("ciudadpr").value = "1";
}

//FUNCION MOSTRAR FORMULARIO NUEVO PROVEEDOR
function abrirModalNuevoProveedor() {

    // limpiar formulario
    limpiarFormularioPr();

    // cambiar título
    document.querySelector("#proveedorModal .modal-title").innerText = "Nuevo Proveedor";

    document.querySelector("#proveedorModal .modalIcon").className = "modalIcon bi bi-person-plus-fill icon-modal";

    // abrir modal
    const modal = new bootstrap.Modal(document.getElementById("proveedorModal"));
    modal.show();
}

function cerrarModalPr() {

    const modalEl = document.getElementById("proveedorModal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    modal.hide();

    limpiarFormularioPr();
}
  //FUNCION OBTENER VALORES DEL FORMULARIO
function obtenerProveedorFormulario() {
    return {
        nombre: document.getElementById("nombrepr").value,
        telefono: document.getElementById("telefonopr").value,
        email: document.getElementById("emailpr").value,
        direccion: document.getElementById("direccionpr").value,
        id_ciudad: document.getElementById("ciudadpr").value,

    };
}
async function guardarProveedor() {

    try {

        const id = document.getElementById("proveedorId").value;

        const proveedor = obtenerProveedorFormulario();

        const url = id
            ? `${API_URL}/api/proveedores/${id}`
            : `${API_URL}/api/proveedores`;

        const method = id ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(proveedor)
        });

        const data = await res.json();

        if (!res.ok) {
            await alertError(data.message || "Error al guardar proveedor");
            return;
        }

        await alertSuccess(id ? "Proveedor actualizado" : "Proveedor creado");

        cerrarModalPr();
        cargarProveedores();

    } catch (error) {
        console.error(error);
        alert("Error de conexión");
    }
}

async function editarProveedor(id) {

    try {
        const res = await fetch(`${API_URL}/api/proveedores/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!res.ok || !data?.data) {
            await alertError(data.message || "Error al obtener proveedor");
            return;
        }

        const pr = data.data;

        // ID oculto
        document.getElementById("proveedorId").value = pr.id_proveedor;

        // Campos
        document.getElementById("nombrepr").value = pr.nombre || "";
        document.getElementById("telefonopr").value = pr.telefono || "";
        document.getElementById("emailpr").value = pr.email || "";
        document.getElementById("direccionpr").value = pr.direccion || ""; 
        document.getElementById("ciudadpr").value = pr.id_ciudad;
        
        // título dinámico
        document.querySelector("#proveedorModal .modal-title").innerText = "Editar Proveedor";

        document.querySelector("#proveedorModal .modalIcon").className ="modalIcon bi bi-pencil-square icon-modal";

        // abrir modal
        const modalEl = document.getElementById("proveedorModal");
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();

    } catch (error) {
        console.error(error);
        await alertError("Error de conexión con el servidor");
    }
}

//FUNCION BUSQUEDA FILTRO PROVEEDOR
async function buscarProveedor() {

    try {

        const inputBusquedaPr = document.getElementById("inputBusquedaProveedor");
        const valorBusquedaPr = inputBusquedaPr.value.trim();

        const ciudad = document.getElementById("filtroCiudadPr").value;
        const provincia = document.getElementById("filtroProvinciaPr").value;

        let response;

        //  BUSQUEDA POR ID (PRIORIDAD MAXIMA)
        if (valorBusquedaPr !== "" && !isNaN(valorBusquedaPr)) {

            response = await fetch(
                `${API_URL}/api/clientes/${valorBusquedaPr}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

        }

        //  FILTROS COMBINADOS
        else {

            const params = new URLSearchParams();

            if (valorBusquedaPr !== "") {
                params.append("nombre", valorBusquedaPr);
            }

            if (ciudad !== "") {
                params.append("ciudad", ciudad);
            }

            if (provincia !== "") {
                params.append("provincia", provincia);
            }

            response = await fetch(
                `${API_URL}/api/proveedores/filtros?${params.toString()}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
        }

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
        }

        const data = await response.json();

        const proveedores = Array.isArray(data.data)
            ? data.data
            : [data.data];

            if (proveedores.length === 0) {
                alertError("Sin resultados","No se encontraron proveedores con esos parámetros");
                 mostrarProveedores([]); // limpia tabla
                return;
            }

        mostrarProveedores(proveedores);

        // LIMPIAR
        inputBusquedaPr.value = "";
        document.getElementById("filtroCiudadPr").value = "";
        document.getElementById("filtroProvinciaPr").value = "";  

    } catch (error) {
        console.error(error);
        alertError("Error al buscar proveedores");
    }
}

function mostrarProveedores(proveedores) {

    const tbody = document.getElementById("tablaProveedores");

    if (!tbody) return;

    tbody.innerHTML = "";

    proveedores.forEach(pr => {
        tbody.innerHTML += `
            <tr>
                <td>${pr.id_proveedor}</td>
                <td>${pr.nombre}</td>
                <td>${pr.telefono}</td>
                <td>${pr.email}</td> 
                <td>${pr.direccion}</td> 
                <td>${pr.ciudad}</td>
                <td>${pr.provincia}</td>
    
                <td>
                    <button class="btn btn-sm btn-editarpr btneditar" data-id="${pr.id_proveedor}">
                        Editar
                    </button>

                    <button class="btn btn-sm btn-eliminarpr btneliminar" data-id="${pr.id_proveedor}">
                        Eliminar
                    </button>
                </td>
            </tr>`;
    });

}

//------------PRODUCTOS---------*//
async function cargarProveedoresSelect() {

    try {
        const res = await fetch(`${API_URL}/api/proveedores`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        const select = document.getElementById("proveedorProducto");

        if (!select) return;

        select.innerHTML = `<option value="">Seleccionar proveedor</option>`;

        data.data.forEach(p => {
            select.innerHTML += `
                <option value="${p.id_proveedor}">
                    ${p.nombre}
                </option>
            `;
        });

    } catch (error) {
        console.error("Error cargando proveedores:", error);
    }
}
// TRAER PRODUCTOS -GET
async function cargarProductos() {

    try {
        const res = await fetch(`${API_URL}/api/productos`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        console.log("PRODUCTOS:", data);

        const tbody = document.getElementById("tablaProductos");

        if (!tbody) return;

        tbody.innerHTML = "";

        data.data.forEach(p => {
            tbody.innerHTML += `
            <tr>
                <td>
                <img 
                    src="${p.imagen_url}" 
                    class="img-producto-mini"
                    data-url="${p.imagen_url}">
                </td>

                <td>${p.id_producto}</td>
                <td>${p.nombre}</td>
                <td>${p.descripcion || ""}</td>
                <td>$${p.precio}</td>
                <td>${p.proveedor || p.id_proveedor}</td>

                <td>
                <a href="${p.prospecto_url}" target="_blank">
                    <i class="bi bi-image icon-prospecto icono-prospecto"></i>
                
                </a>
                </td>
    
                <td class="acciones_acciones">
                        <button class="btn btn-sm btn-editarpd btneditar" data-id="${p.id_producto}">Editar</button>
                        <button class="btn btn-sm btn-eliminarpd btneliminar" data-id="${p.id_producto}">Eliminar</button>
                </td>
            </tr>
            `;
        });

    } catch (error) {
        console.error("Error cargando proveedor:", error);
    }
}

function verImagen(url) {
    window.open(url, "_blank");
}

//FUNCION ELIMINAR PRODUCTOS
async function eliminarProducto(id) {

    try{ // manejo de bloque 
        const confirmar = await confirmDelete("¿Seguro que querés eliminar este producto?"); //muestra un poup del navegador con mensaje

        if (!confirmar.isConfirmed) return;
        const res = await fetch(`${API_URL}/api/productos/${id}/eliminar`, { //peticion al backend
            method: "PATCH",
            headers: { // cabecera HTTP, metaddata del la request
                "Authorization": `Bearer ${token}` //envio del token (Bearer es el esquema de autenticacion y token esta guardado en el localStorage)
            }
        });
        console.log("STATUS:", res.status);
        console.log("URL:", `${API_URL}/api/productos/${id}/eliminar`);

        const data = await res.json();
        console.log(data);
        if(!res.ok){ //si hay error muestra el mensaje
            await alertError(data.message || "Error al eliminar producto");
            return; //corta la ejecucion si hubo error
        }

        await alertSuccess(data.message); //mensaje de exito

        //refrescar tabla
        cargarProductos();

    }catch (error){ //captura el error
        console.error("Error eliminando producto:", error); //mensaje debbug
        await alertError("Error de conexión con el servidor");
    }
};

// FUNCION LIMPIAR FORMULARIO PRODUCTOS
function limpiarFormularioPd() {

    const ids = [
        "productoId",
        "nombre",
        "descripcion",
        "precio"
    ];

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });

    // Select proveedor
    const proveedor = document.getElementById("proveedorProducto2");
    if (proveedor) proveedor.value = "";

    // Inputs de archivos
    const imagen = document.getElementById("imagenProducto");
    if (imagen) imagen.value = "";

    const prospecto = document.getElementById("prospectoProducto");
    if (prospecto) prospecto.value = "";

    // Preview imagen producto
    const previewImg = document.getElementById("previewImagenProducto");
    if (previewImg) {
        previewImg.src = "";
        previewImg.style.display = "none";
    }

    // Preview prospecto
    const previewProspecto = document.getElementById("previewProspecto");
    if (previewProspecto) {
        previewProspecto.innerHTML = "";
    }
}

async function cargarProveedoresModal() {

    try {
        const res = await fetch(`${API_URL}/api/proveedores`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        const select = document.getElementById("proveedorProducto2");

        if (!select) return [];

        select.innerHTML = `<option value="">Seleccionar proveedor</option>`;

        data.data.forEach(p => {
            select.innerHTML += `
                <option value="${p.id_proveedor}">
                    ${p.nombre}
                </option>
            `;
        });

        return data.data; 

    } catch (error) {
        console.error("Error cargando proveedores:", error);
        return [];
    }
}

function abrirModalNuevoProducto() {

    limpiarFormularioPd();

    cargarProveedoresModal(); 

    document.querySelector("#productoModal .modal-title").innerText = "Nuevo Producto";
    document.querySelector("#productoModal .modalIcon").className = "modalIcon bi bi-capsule icon-producto icon-modal";

    const modal = new bootstrap.Modal(document.getElementById("productoModal"));
    modal.show();
}
function cerrarModalPd() {

    const modalEl = document.getElementById("productoModal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    modal.hide();

    limpiarFormularioPd();
}
// FUNCIÓN PARA GUARDAR UN PRODUCTO (con imagenes y archivos)
async function guardarProducto() {

    // Obtener ID oculto
    const id = document.getElementById("productoId").value;

    // Creamos un FormData (permite enviar texto + archivos juntos)
    const formData = new FormData();

    // Agregamos el nombre del producto desde el input
    formData.append(
        "nombre",
        document.getElementById("nombre").value
    );

    // Agregamos la descripción del producto
    formData.append(
        "descripcion",
        document.getElementById("descripcion").value
    );

    // Agregamos el precio del producto
    formData.append(
        "precio",
        document.getElementById("precio").value
    );

    // Agregamos el proveedor seleccionado (ID)
    formData.append(
        "id_proveedor",
        document.getElementById("proveedorProducto2").value
    );

    // Obtenemos el archivo de imagen (solo el primero seleccionado)
    const imagen =
        document.getElementById("imagenProducto").files[0];

    // Obtenemos el archivo del prospecto (imagen o PDF)
    const prospecto =
        document.getElementById("prospectoProducto").files[0];

    // Si el usuario seleccionó una imagen, la agregamos al FormData
    if (imagen) {
        formData.append("imagen", imagen);
    }

    // Si el usuario seleccionó un prospecto, lo agregamos al FormData
    if (prospecto) {
        formData.append("prospecto", prospecto);
    }

     // Definir URL y método según exista ID
    const url = id
        ? `${API_URL}/api/productos/${id}`
        : `${API_URL}/api/productos`;

    const metodo = id ? "PUT" : "POST";

    const res = await fetch(url, {
        method: metodo,
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: formData
    });

    const data = await res.json();

    if (!res.ok) {
        await alertError(
            data.message || "Error al guardar producto"
        );
        return;
    }

    await alertSuccess(
        id
            ? "Producto actualizado correctamente"
            : "Producto creado correctamente"
    );

    cerrarModalPd();
    cargarProductos();
}

async function editarProducto(id) {

    try {

        // 1. Cargar proveedores primero (IMPORTANTE)
        await cargarProveedoresModal();

        // 2. Traer producto
        const res = await fetch(
            `${API_URL}/api/productos/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await res.json();

        console.log("RESPUESTA:", data);

        if (!res.ok || !data?.data) {
            await alertError(
                data.message || "Error al obtener producto"
            );
            return;
        }

        const pd = data.data;

        console.log("PRODUCTO:", pd);

        // 3. ID oculto
        document.getElementById("productoId").value = pd.id_producto;

        // 4. Inputs básicos
        document.getElementById("nombre").value = pd.nombre || "";
        document.getElementById("descripcion").value = pd.descripcion || "";
        document.getElementById("precio").value = pd.precio || "";

        // 5. PROVEEDOR (FIX DEFINITIVO)
        const selectProveedor = document.getElementById("proveedorProducto2");

        if (selectProveedor) {

            const value = String(pd.id_proveedor);

            // forzar coincidencia después de que options estén listos
            setTimeout(() => {
                selectProveedor.value = value;
            }, 0);
        }

        // 6. IMAGEN (SIN ERROR SI NO EXISTE)
        const previewImg = document.getElementById("previewImagenProducto");

        if (previewImg) {
            if (pd.imagen_url) {
                previewImg.src = pd.imagen_url;
                previewImg.style.display = "block";
            } else {
                previewImg.src = "";
                previewImg.style.display = "none";
            }
        }

        // 7. PROSPECTO
        const previewProspecto = document.getElementById("previewProspecto");

        if (previewProspecto) {
            if (pd.prospecto_url) {
                previewProspecto.innerHTML = `
                    <a href="${pd.prospecto_url}" target="_blank">
                        Ver prospecto actual
                    </a>
                `;
            } else {
                previewProspecto.innerHTML = "";
            }
        }

        // 8. MODAL UI
        document.querySelector("#productoModal .modal-title")
            .innerText = "Editar Producto";

        document.querySelector("#productoModal .modalIcon")
            .className = "modalIcon bi bi-pencil-square icon-modal";

        // 9. Mostrar modal
        const modal = bootstrap.Modal.getOrCreateInstance(
            document.getElementById("productoModal")
        );

        modal.show();

    } catch (error) {
        console.error(error);
        await alertError("Error de conexión con el servidor");
    }
}

//FUNCION BUSQUEDA FILTRO PRODUCTO
async function buscarProducto() {

    try {

        const inputBusquedaPd = document.getElementById("inputBusquedaProducto");
        const valorBusquedaPd = inputBusquedaPd.value.trim();

        const proveedor = document.getElementById("proveedorProducto").value;

        let response;

        //  BUSQUEDA POR ID (PRIORIDAD MAXIMA)
        if (valorBusquedaPd !== "" && !isNaN(valorBusquedaPd)) {

            response = await fetch(
                `${API_URL}/api/productos/${valorBusquedaPd}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

        }

        //  FILTROS COMBINADOS
        else {

            const params = new URLSearchParams();

            if (valorBusquedaPd !== "") {
                params.append("nombre", valorBusquedaPd);
            }

            if (proveedor !== "") {
                params.append("proveedor", proveedor);
            }

            response = await fetch(
                `${API_URL}/api/productos/filtros?${params.toString()}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
        }

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
        }

        const data = await response.json();

        const productos = Array.isArray(data.data)
            ? data.data
            : [data.data];

            if (productos.length === 0) {
                alertError("Sin resultados","No se encontraron productos con esos parámetros");
                 mostrarProductos([]); // limpia tabla
                return;
            }

        mostrarProductos(productos);

        // LIMPIAR
        inputBusquedaPd.value = "";
        document.getElementById("proveedorProducto").value = ""; 

    } catch (error) {
        console.error(error);
        alertError("Error al buscar producto");
    }
}

function mostrarProductos(productos) {

    const tbody = document.getElementById("tablaProductos");

    if (!tbody) return;

    tbody.innerHTML = "";

    productos.forEach(p => {
        tbody.innerHTML += `
            <tr>
                <td>
                <img 
                    src="${p.imagen_url}" 
                    class="img-producto-mini"
                    data-url="${p.imagen_url}">
                </td>

                <td>${p.id_producto}</td>
                <td>${p.nombre}</td>
                <td>${p.descripcion || ""}</td>
                <td>$${p.precio}</td>
                <td>${p.proveedor || p.id_proveedor}</td>

                <td>
                <a href="${p.prospecto_url}" target="_blank">
                    <i class="bi bi-image icon-prospecto icono-prospecto"></i>
                
                </a>
                </td>
    
                <td class="acciones_acciones">
                        <button class="btn btn-sm btn-editarpd btneditar" data-id="${p.id_producto}">Editar</button>
                        <button class="btn btn-sm btn-eliminarpd btneliminar" data-id="${p.id_producto}">Eliminar</button>
                </td>
            </tr>
            `;
    });

}
//-*-*-*-*-*-*-*STOCK*-*-*-*-*-*-**-
// TRAER STOCK
async function cargarStock() {

    try {
        const res = await fetch(`${API_URL}/api/stock`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        const tbody = document.getElementById("tablaStock");

        if (!tbody) return;

        tbody.innerHTML = "";
            console.log("Antes del forEach");
        data.data.forEach(s => {

                let badgeEstado = "";

                switch (s.estado) {

            case "SIN CONFIGURAR":
                badgeEstado =
                    '<span class="badge bg-secondary">SIN CONFIGURAR</span>';
                break;

            case "SIN STOCK":
                badgeEstado =
                    '<span class="badge bg-dark">SIN STOCK</span>';
                break;

            case "CRÍTICO":
                badgeEstado =
                    '<span class="badge bg-danger">CRÍTICO</span>';
                break;

            case "BAJO":
                badgeEstado =
                    '<span class="badge bg-warning text-dark">BAJO</span>';
                break;

            default:
                badgeEstado =
                    '<span class="badge bg-success">OK</span>';
        }

    tbody.innerHTML += `
    <tr>

        <td>
            <img
                src="${s.imagen_url}"
                class="img-producto-mini"
                data-url="${s.imagen_url}">
        </td>
        <td>${s.id_producto}</td>
        <td>${s.nombre}</td>
        <td>${s.cantidad_disponible}</td>
        <td>${s.punto_reposicion}</td>
        <td>${s.cantidad_reservada}</td>
        <td>${badgeEstado}</td>
        <td>${s.ultima_actualizacion}</td>
        <td>
            <button
                class="btn btn-sm btn-editarStock btneditar"
                data-id="${s.id_stock}">
                Editar
            </button>
        </td>

    </tr>`;});
    }catch (error) {
        console.error("Error cargando stock:", error)
    }
}

// FUNCION LIMPIAR FORMULARIO Stock
function limpiarFormularioStock() {

    const ids = [
        "stockId",
        "cantidad_stock",
        "reposicion"
    ];

    ids.forEach(id => {

        const el = document.getElementById(id);

        if (el) {
            el.value = "";
        }

    });

}
function abrirModalStock() {

    limpiarFormularioStock();


    document.querySelector("#stockModal .modal-title").innerText = "Editar Stock";
    document.querySelector("#stockModal .modalIcon").className = "modalIcon bi bi-boxes icon-modal";

    const modal = new bootstrap.Modal(document.getElementById("stockModal"));
    modal.show();
}

function cerrarModalStock() {

    const modalEl = document.getElementById("stockModal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    modal.hide();

    limpiarFormularioStock();
}
async function guardarStock() {

    try {

        const id = document.getElementById("stockId").value;

        const stock = obtenerStockFormulario();

        const res = await fetch(
            `${API_URL}/api/stock/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(stock)
            }
        );

        const data = await res.json();

        if (!res.ok) {

            await alertError(
                "Error",
                data.message || "No se pudo actualizar el stock"
            );

            return;
        }

        await alertSuccess(
            "Éxito",
            "Stock actualizado correctamente"
        );

        cerrarModalStock();

        cargarStock();

    } catch (error) {

        console.error(error);

        await alertError(
            "Error",
            "Error de conexión con el servidor"
        );
    }
}

async function editarStock(id) {

    try {

        const res = await fetch(`${API_URL}/api/stock/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!res.ok) {

            await alertError(
                "Error",
                data.message || "No se pudo obtener el stock"
            );

            return;
        }

        const stock = data.data;

        // Llenar formulario
        document.getElementById("stockId").value =
            stock.id_stock;

        document.getElementById("cantidad_stock").value =
            stock.cantidad_disponible;

        document.getElementById("reposicion").value =
            stock.punto_reposicion;

        // Cambiar título e icono
        document.querySelector(
            "#stockModal .modal-title"
        ).innerText = "Editar Stock";

        document.querySelector(
            "#stockModal .modalIcon"
        ).className =
            "modalIcon bi bi-clipboard-data icon-modal";

        // Abrir modal
        const modal = new bootstrap.Modal(
            document.getElementById("stockModal")
        );

        modal.show();

    } catch (error) {

        console.error(error);

        await alertError(
            "Error",
            "No se pudo cargar el stock"
        );

    }
}

//FUNCION BUSQUEDA FILTRO PRODUCTO POR STOCK
// FUNCIÓN BUSCAR STOCK
async function buscarProductoPorStock() {

    try {

        const valorBusqueda =
            document.getElementById("inputBusquedaStock")
                .value
                .trim()
                .toLowerCase();

        const estado =
            document.getElementById("filtroStock").value;

        // Traemos toda la lista
        const response = await fetch(`${API_URL}/api/stock`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
        }

        const data = await response.json();

        let stocks = data.data;

        // FILTRO POR ID O NOMBRE
        if (valorBusqueda !== "") {

            stocks = stocks.filter(s =>

                s.id_producto.toString() === valorBusqueda ||

                s.nombre.toLowerCase().includes(valorBusqueda)
            );

        }

        // FILTRO POR ESTADO
        if (estado !== "") {

            stocks = stocks.filter(s =>
                s.estado === estado
            );

        }

        if (stocks.length === 0) {

            await alertError(
                "Sin resultados",
                "No se encontraron productos con esos parámetros"
            );

            mostrarStock([]);
            return;
        }

        mostrarStock(stocks);

    } catch (error) {

        console.error(error);

        await alertError(
            "Error",
            "Error al buscar stock"
        );

    }
}

function obtenerStockFormulario() {

    return {

        cantidad_disponible:
            parseInt(document.getElementById("cantidad_stock").value) || 0,

        punto_reposicion:
            parseInt(document.getElementById("reposicion").value) || 0

    };

}

function mostrarStock(stocks) {

    const tbody = document.getElementById("tablaStock");

    if (!tbody) return;

    tbody.innerHTML = "";

    stocks.forEach(s => {

                let badgeEstado = "";

                switch (s.estado) {

            case "SIN CONFIGURAR":
                badgeEstado =
                    '<span class="badge bg-secondary">SIN CONFIGURAR</span>';
                break;

            case "SIN STOCK":
                badgeEstado =
                    '<span class="badge bg-dark">SIN STOCK</span>';
                break;

            case "CRÍTICO":
                badgeEstado =
                    '<span class="badge bg-danger">CRÍTICO</span>';
                break;

            case "BAJO":
                badgeEstado =
                    '<span class="badge bg-warning text-dark">BAJO</span>';
                break;

            default:
                badgeEstado =
                    '<span class="badge bg-success">OK</span>';
        }

    tbody.innerHTML += `
    <tr>

        <td>
            <img
                src="${s.imagen_url}"
                class="img-producto-mini"
                data-url="${s.imagen_url}">
        </td>
        <td>${s.id_producto}</td>
        <td>${s.nombre}</td>
        <td>${s.cantidad_disponible}</td>
        <td>${s.punto_reposicion}</td>
        <td>${s.cantidad_reservada}</td>
        <td>${badgeEstado}</td>
        <td>${s.ultima_actualizacion}</td>
        <td>
            <button
                class="btn btn-sm btn-editarStock btneditar"
                data-id="${s.id_stock}">
                Editar
            </button>
        </td>

    </tr>`;});

}
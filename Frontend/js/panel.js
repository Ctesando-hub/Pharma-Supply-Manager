    import { alertSuccess, alertError, confirmDelete } from "./alerts.js"

    const token = localStorage.getItem("token"); // Obtiene el token de autenticación guardado en el navegador
    const rol = localStorage.getItem("rol"); // Obtiene el rol del usuario guardado en el navegador
    const nombre = localStorage.getItem("nombre"); //Obtiene el nombre del usuario y apellido
    const apellido = localStorage.getItem("apellido");
    const idUsuario = localStorage.getItem("id_usuario"); //obtiene el ID del Usuario
    const API_URL = "https://pharma-supply-manager-production-f1c3.up.railway.app";
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

    cargarDashboard();

    inicializarPasswordToggle();

    const moduloInicial = localStorage.getItem("moduloInicial");

    if (moduloInicial) {
        manejarModulo(moduloInicial);
        localStorage.removeItem("moduloInicial");
    }

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
        "sucursales",
        "reportes"
        
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
        "provincias",
        "reportes"
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
    const rolElement = document.querySelector(".sidebar-user-role");

    if (rolElement) {
        rolElement.innerText = "Empleado";
    }

    document.querySelector(".user-box span.fw-bold")
    .innerText = "Empleado";
    aplicarPermisos(permisos.empleado);

};

//Panel Gerente: nombre rol
function configurarGerente(){
const rolElement = document.querySelector(".sidebar-user-role");

    if (rolElement) {
        rolElement.innerText = "Gerente";
    }

    document.querySelector(".user-box span.fw-bold")
    .innerText = "Gerente";
    aplicarPermisos(permisos.gerente);

};

//FUNCION CENTRAL PERMISOS
function aplicarPermisos(modulosPermitidos) { // Oculta o muestra módulos según permisos del rol
    document.querySelectorAll(".nav-card").forEach(card => { // Selecciona todos los elementos del menú
        const modulo = card.dataset.module;
        if (!modulosPermitidos.includes(modulo)) {
            card.parentElement.remove();
        }

        // Ocultar botón "Abrir Centro de Reportes"
    const btnReportes = document.getElementById("btnReportes");

    if (btnReportes && !modulosPermitidos.includes("reportes")) {
        btnReportes.style.display = "none";
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
            mostrarSeccion("ubicacionesSection");
            mostrarModuloUbicaciones("provincias");
    
            break;

            case "compras":
            mostrarSeccion("comprasSection");
            cargarCompras();
            cargarProveedoresFiltroCompra()
            break;

            case "ventas":
                mostrarSeccion("pedidosSection");
                cargarPedidos();
                cargarClientesFiltroPedido()
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

        // BOTON EDITAR COMPRA
        if (e.target.classList.contains("btn-editarCompra")) {
            const id = e.target.dataset.id;
            editarCompra(id);
        }

         // BOTON EDITAR PEDIDO
        if (e.target.classList.contains("btn-editarPedido")) {
            const id = e.target.dataset.id;
            editarPedido(id);
        }

         // BOTON EDITAR PROVINCIA
        if (e.target.classList.contains("btn-editarProvincia")) {
            const id = e.target.dataset.id;
            editarProvincia(id);
        }

         // BOTON EDITAR CIUDAD
        if (e.target.classList.contains("btn-editarCiudad")) {
            const id = e.target.dataset.id;
            editarCiudad(id);
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

        //BOTON ELIMINAR PROVINCIA
        if (e.target.classList.contains("btn-eliminarProvincia")) {
            const id = e.target.dataset.id;
            eliminarProvincia(id);
        }

         //BOTON ELIMINAR CIUDAD
        if (e.target.classList.contains("btn-eliminarCiudad")) {
            const id = e.target.dataset.id;
            eliminarCiudad(id);
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

         // NUEVA COMPRA -MODAL
        if (e.target.id === "btnNuevaCompra") {
            abrirModalNuevaCompra();
        }

        // NUEVO PEDIDO-MODAL
        if (e.target.id === "btnNuevoPedido") {
            abrirModalNuevoPedido();
        }

        // NUEVA PROVINCIA-MODAL
        if (e.target.id === "btnNuevaProvincia") {
            abrirModalNuevaProvincia();
        }

        // NUEVA CIUDAD-MODAL
        if (e.target.id === "btnNuevaCiudad") {
            abrirModalNuevaCiudad();
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

        //GUARDAR COMPRA
        if (e.target.id === "btnGuardarCompra") {
            guardarCompra();
        }

         //GUARDAR PEDIDO
        if (e.target.id === "btnGuardarPedido") {
            guardarPedido();
        }

         //GUARDAR PROVINCIA
        if (e.target.id === "btnGuardarProvincia") {
            guardarProvincia();
        }

         //GUARDAR CIUDAD
        if (e.target.id === "btnGuardarCiudad") {
            guardarCiudad();
        }

        //GUARDAR ACTUALIZACION COMPRA
        if (e.target.id === "btnActualizarEstadoCompra"){
            actualizarCompra();
        }

         //GUARDAR ACTUALIZACION PEDIDO
        if (e.target.id === "btnActualizarEstadoPedido"){
            actualizarPedido();
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

        //BUSCAR COMPRAS/FILTRO
        if(e.target.id ==="btnBuscarCompras"){
            buscarCompras();
        }

        //BUSCAR PEDIDOS/FILTRO
        if(e.target.id ==="btnBuscarPedidos"){
            buscarPedidos();
        }

        // RESTABLECER USUARIOS
        if (e.target.id === "btnLimpiarUsuarios") {
            limpiarFiltros();
            document.getElementById("estadoTodos").checked = true;
            cargarUsuarios();
        }

        // RESTABLECER CLIENTES
        if (e.target.id === "btnLimpiarClientes") {
            limpiarFiltros();
            cargarClientes();
        }

        //RESTABLECER PROVEEDORES
        if (e.target.id === "btnLimpiarProveedores"){

            limpiarFiltros();
            cargarProveedores()
        }
        // RESTABLECER PRODUCTOS
        if (e.target.id === "btnLimpiarProductos") {
            limpiarFiltros();
            cargarProductos();
        }

        // RESTABLECER STOCK
        if (e.target.id === "btnLimpiarStock") {
            limpiarFiltros();
            cargarStock();
        }

        //RESTABLECER COMPRAS
        if(e.target.id === "btnLimpiarCompras"){
            limpiarFiltrosCompras();
            cargarCompras();
        }

        //RESTABLECER PEDIDOS
        if(e.target.id === "btnLimpiarPedidos"){
            limpiarFiltrosPedidos();
            cargarPedidos();
        }
        
        // CLICK IMAGEN PRODUCTO
        if (e.target.classList.contains("img-producto-mini")) {

            const url = e.target.dataset.url;

            if (url) {
                window.open(url, "_blank");
            }
        }

        // VER DETALLE COMPRA
        if (e.target.closest(".btn-verCompra")) {

            const id = e.target.closest(".btn-verCompra").dataset.id;

            verDetalleCompra(id);
        }

        // VER DETALLE PEDIDO
        if (e.target.closest(".btn-verPedido")) {

            const id = e.target.closest(".btn-verPedido").dataset.id;

            verDetallePedido(id);
        }

        //agregar productos al carrito temporal
        if (e.target.id === "btnAgregarProductoCompra") {
            agregarProductoCompra();
        }

         //agregar productos al carrito temporal de pedidos
        if (e.target.id === "btnAgregarProductoPedido") {
            agregarProductoPedido();
        }

        // ELIMINAR ITEM DEL DETALLE DE COMPRA
        if (e.target.closest(".btnEliminarItemCompra")) {

            const index =
                e.target.closest(".btnEliminarItemCompra").dataset.index;

            eliminarItemCompra(index);
        }

        // ELIMINAR ITEM DEL DETALLE DE PEDIDO
        if (e.target.closest(".btnEliminarItemPedido")) {

            const index =
                e.target.closest(".btnEliminarItemPedido").dataset.index;

            eliminarItemPedido(index);
        }

         // MÓDULO PROVINCIAS
        if (e.target.id === "btnModuloProvincias") {
            mostrarModuloUbicaciones("provincias");
            cargarProvincias();
        }

        // MÓDULO CIUDADES
        if (e.target.id === "btnModuloCiudades") {
            mostrarModuloUbicaciones("ciudades");
            cargarCiudades();
        }

    });
      // EVENTOS DEL MODAL DE COMPRAS
        //Mostrar productos por proveedor
        document.getElementById("proveedorCompraModal")
            ?.addEventListener("change", () => {

                const idProducto =
                    document.getElementById("proveedorCompraModal").value;

                cargarProductossModalCompra(idProducto);

            });

        // Calcular subtotal al modificar cantidad
        document.getElementById("cantidadCompra")
            ?.addEventListener("input", calcularSubtotalCompra);

        // Calcular subtotal al modificar precio
        document.getElementById("precioUnitarioCompra")
            ?.addEventListener("input", calcularSubtotalCompra);

        
            // EVENTOS DEL MODAL DE PEDIDOS;

             //Mostrar precio del producto
        document.getElementById("productoPedido")
            ?.addEventListener("change", () => {

                const idProducto =
                    document.getElementById("productoPedido").value;

                cargarPrecioModalPedido(idProducto);
                cargarDisponibilidadProducto(idProducto);

            });

        // Calcular subtotal al modificar cantidad
        document.getElementById("cantidadPedido")
            ?.addEventListener("input", calcularSubtotalPedido);

        // Calcular subtotal al modificar precio
        document.getElementById("precioUnitarioPedido")
            ?.addEventListener("input", calcularSubtotalPedido);
}

function limpiarFiltros() {

    document.querySelectorAll(".filtro-campo").forEach(campo => {

        if (
            campo.type === "text" ||
            campo.type === "number" ||
            campo.type === "date"
        ) {

            campo.value = "";
        }
        else if (campo.tagName === "SELECT") {

            campo.selectedIndex = 0;
        }
        else if (
            campo.type === "radio" ||
            campo.type === "checkbox") {

            campo.checked = false;
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
            <option
            value="${p.id_producto}"
            data-proveedor="${p.id_proveedor}">
            ${p.nombre}
        </option>`;  
            
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

//-*-*-*-*-*COMPRAS-*-*-*-*-*-*-
    let detalleCompra = [];
// TRAER COMPRAS
async function cargarCompras() {

    try {

        const res = await fetch(`${API_URL}/api/compras`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        const tbody = document.getElementById("tablaCompras");

        if (!tbody) return;

        tbody.innerHTML = "";

        data.data.forEach(co => {

            let badgeEstado = "";

            switch (co.estado) {
                case "Pendiente":
                    badgeEstado ='<span class="badge bg-secondary">Pendiente</span>';
                    break;

                case "En proceso":
                    badgeEstado ='<span class="badge bg-warning text-dark">En proceso</span>';
                    break;

                case "Completado":
                    badgeEstado ='<span class="badge bg-success">Completado</span>';
                    break;

                default:
                    badgeEstado ='<span class="badge bg-danger">Cancelado</span>';
            }

            tbody.innerHTML += `
            <tr>
                <td>${co.id_compra}</td>
                <td>${new Date(co.fecha).toLocaleDateString("es-AR")}</td>
                <td>${co.proveedor}</td>
                <td>${co.usuario_HizoCompra}</td>
                <td>${co.sucursal}</td>
                <td>$${co.total}</td>
                <td>${badgeEstado}</td>
                <td class="acciones_acciones">
                    <button
                        class="btn btn-sm btn-editarCompra btneditar"
                        data-id="${co.id_compra}">
                        Editar
                    </button>
                    <button
                        class="btn btn-sm btn-verCompra"
                        data-id="${co.id_compra}">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            </tr>`;
        });

    } catch (error) {
        console.error("Error cargando compras:", error);
    }
}

async function cargarProveedoresFiltroCompra() {

    try {
        const res = await fetch(`${API_URL}/api/proveedores`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        const data = await res.json();

        const select = document.getElementById("filtroProveedorCompra");

        if(!select) return;
        select.innerHTML =
            `<option value="">Todos</option>`;

        data.data.forEach(p => {
            select.innerHTML += `
                <option value="${p.id_proveedor}">${p.nombre}</option>`;
        });

    } catch(error){
        console.error(error);
    }
}
async function cargarProveedoresModalCompra() {

    try {
        const res = await fetch(`${API_URL}/api/proveedores`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        const select = document.getElementById("proveedorCompraModal");
        if (!select) return;

        select.innerHTML = `<option value="">Seleccionar proveedor</option>`;

        data.data.forEach(p => {
            select.innerHTML += `
                <option value="${p.id_proveedor}">
                    ${p.nombre}
                </option>`;
        });

    } catch (error) {
        console.error(error);
    }
}

function mostrarProveedorProducto() {

    const selectProducto = document.getElementById("productoCompra");

    const opcionSeleccionada =
        selectProducto.options[selectProducto.selectedIndex];

    // si no hay producto seleccionado
    if (!opcionSeleccionada) return;

    const proveedorId = opcionSeleccionada.dataset.proveedor;

    if (proveedorId) {
        document.getElementById("proveedorCompraModal").value = proveedorId;
    }
}

async function cargarProductossModalCompra(idProveedor = null) {
    try {
        const res = await fetch(`${API_URL}/api/productos`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        const select = document.getElementById("productoCompra");
        if (!select) return;

        select.innerHTML = `<option value="">Seleccionar producto</option>`;

        const productos = idProveedor
            ? data.data.filter(p => p.id_proveedor == idProveedor)
            : data.data;

        productos.forEach(p => {
        select.innerHTML += `
            <option 
            value="${p.id_producto}"
            data-proveedor="${p.id_proveedor}">
            ${p.id_producto} - ${p.nombre}
            </option>`;
        });

    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

function abrirModalNuevaCompra() {

    cargarProveedoresModalCompra();

    // limpiar productos hasta que elijan proveedor
    const select = document.getElementById("productoCompra");
    if (select) {
        select.innerHTML = `<option value="">Seleccionar producto</option>`;
    }

    document.querySelector("#compraModal .modal-title").innerText = "Nueva Compra";
    document.querySelector("#compraModal .modalIcon").className =
        "modalIcon bi bi-cart-plus icon-modal";

    const modal = new bootstrap.Modal(document.getElementById("compraModal"));
    modal.show();
}

// calcular subtotal: 
function calcularSubtotalCompra() {

    const cantidad =
        parseFloat(document.getElementById("cantidadCompra").value) || 0;

    const precio =
        parseFloat(document.getElementById("precioUnitarioCompra").value) || 0;

    document.getElementById("subtotalCompra").value =
        (cantidad * precio).toFixed(2);
}

function renderDetalleCompra() {

    const tbody = document.getElementById("tablaDetalleCompra");
    tbody.innerHTML = "";

    detalleCompra.forEach((item, index) => {

        tbody.innerHTML += `
            <tr>
                <td>${item.nombreProducto}</td>
                <td>${item.cantidad}</td>
                <td>${item.precio.toFixed(2)}</td>
                <td>${item.subtotal.toFixed(2)}</td>
                <td>
                    <button
                        class="btn btn-danger btn-sm btnEliminarItemCompra"
                        data-index="${index}">
                        <i class="bi bi-trash"></i>
                    </button
                </td>
            </tr>
        `;
    });
}

function calcularTotalCompra() {

    const total = detalleCompra.reduce((acc, item) => acc + item.subtotal, 0);

    document.getElementById("totalCompra").value = total.toFixed(2);
}
 //limpiar inputs de detalle compra
function limpiarInputsProducto() {
    document.getElementById("cantidadCompra").value = "";
    document.getElementById("precioUnitarioCompra").value = "";
    document.getElementById("subtotalCompra").value = "";
}
 // Agregar productos a la lista de compras
function agregarProductoCompra() {

    const selectProducto = document.getElementById("productoCompra");
    const idProducto = selectProducto.value;
    const nombreProducto = selectProducto.options[selectProducto.selectedIndex]?.text;

    const cantidad = parseFloat(document.getElementById("cantidadCompra").value) || 0;
    const precio = parseFloat(document.getElementById("precioUnitarioCompra").value) || 0;
    const subtotal = parseFloat(document.getElementById("subtotalCompra").value) || 0;

    if (!idProducto || cantidad <= 0 || precio <= 0) {
        alertError("Completa producto, cantidad y precio");
        return;
    }

    const existe = detalleCompra.find(p => p.idProducto == idProducto);

    if (existe) {
        existe.cantidad += cantidad;
        existe.subtotal += subtotal;
    } else {
        detalleCompra.push({
            idProducto,
            nombreProducto,
            cantidad,
            precio,
            subtotal
        });
    }

    renderDetalleCompra();
    calcularTotalCompra();

    limpiarInputsProducto();
}

function eliminarItemCompra(index) {

    detalleCompra.splice(index, 1);

    renderDetalleCompra();

    calcularTotalCompra();
}

function obtenerCompraFormulario() {

    return {

        id_proveedor:
            parseInt(document.getElementById("proveedorCompraModal").value),

        id_usuario: parseInt(idUsuario),

        id_sucursal:
            parseInt(document.getElementById("sucursalCompra").value),

        id_estado:
            parseInt(document.getElementById("compraEstado").value),

        total:
            parseFloat(document.getElementById("totalCompra").value) || 0,

        productos: detalleCompra.map(item => ({
            id_producto: parseInt(item.idProducto),
            cantidad: item.cantidad,
            precio_unitario: item.precio
        }))
    };
}

async function guardarCompra() {

    try {

        const id = document.getElementById("compraId").value;
        const compra = obtenerCompraFormulario();
        const url = id
            ? `${API_URL}/api/compras/${id}`
            : `${API_URL}/api/compras`;

        const method = id ? "PUT" : "POST";
        const res = await fetch(url, {

            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(compra)
        });

        const data = await res.json();

        if (!res.ok) {
            await alertError(
                data.message || "Error al guardar compra"
            );
        return;
        }
        await alertSuccess(
            id ? "Compra actualizada" : "Compra creada"
        );

        cerrarModalCompra();
        await cargarCompras();

    }

    catch (error) {
        console.error(error);
        alertError("Error de conexión");
    }
}

//Funcion de cerrar el modal de nueva Compra y limpia los campos
function cerrarModalCompra() {

    const modal = bootstrap.Modal.getInstance(
        document.getElementById("compraModal")
    );

    if (modal) {
        modal.hide();
    }

    document.getElementById("compraId").value = "";
    document.getElementById("proveedorCompraModal").value = "";
    document.getElementById("productoCompra").innerHTML =
        `<option value="">Seleccionar producto</option>`;

    document.getElementById("cantidadCompra").value = "";
    document.getElementById("precioUnitarioCompra").value = "";
    document.getElementById("subtotalCompra").value = "";
    document.getElementById("totalCompra").value = "";

    detalleCompra = [];

    renderDetalleCompra();
}

//Funcion mostral el modal de detalle de cada compra
function mostrarModalDetalleCompra(productos) {

    const tbody = document.getElementById("tablaDetalleCompraVer");

    tbody.innerHTML = "";

    productos.forEach(p => {

        tbody.innerHTML += `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.cantidad}</td>
                <td>$${p.precio_unitario}</td>
                <td>$${p.subtotal}</td>
            </tr>
        `;
    });

    new bootstrap.Modal(
        document.getElementById("detalleCompraModal")
    ).show();
}

//Funcion ver detalle compra
async function verDetalleCompra(id) {

    try {

            const res = await fetch(`${API_URL}/api/compras/${id}/detalle`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        mostrarModalDetalleCompra(data.data);

    } catch(error) {

        console.error(error);

        alertError("No se pudo cargar el detalle");

    }

}

// Función Editar estado compra
async function editarCompra(id) {

    try {

        // 1. compra general
        const resCompra = await fetch(
            `${API_URL}/api/compras/${id}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        const dataCompra = await resCompra.json();

        if (!resCompra.ok) {
            await alertError(dataCompra.message);
            return;
        }

        const compra = dataCompra.data;

        // VALIDACIÓN PRIMERO (regla de negocio)
        if (compra.estado?.toLowerCase() === "completado") {
            await alertError("El estado ya está completado. No se puede editar esta compra.");
            return;
        }

        // 2. detalle productos (solo si se puede editar)
        const resDetalle = await fetch(
            `${API_URL}/api/compras/${id}/detalle`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        const dataDetalle = await resDetalle.json();

        if (!resDetalle.ok) {
            await alertError(dataDetalle.message);
            return;
        }

        // ===== CABECERA -----
        document.getElementById("editarCompraId").value = compra.id_compra;
        document.getElementById("editarCompraProveedor").value = compra.proveedor;
        document.getElementById("editarCompraSucursal").value = compra.sucursal;
        document.getElementById("editarCompraFecha").value = compra.fecha?.substring(0, 10);
        document.getElementById("editarCompraTotal").value = compra.total;
        document.getElementById("editarCompraEstado").value = compra.id_estado;

        // ----- DETALLE ----
        const tbody = document.getElementById("tablaEditarDetalleCompra");
        tbody.innerHTML = "";

        dataDetalle.data.forEach(p => {

            tbody.innerHTML += `
                <tr>
                    <td>${p.nombre}</td>
                    <td>${p.cantidad}</td>
                    <td>${Number(p.precio_unitario).toFixed(2)}</td>
                    <td>${Number(p.subtotal).toFixed(2)}</td>
                </tr>
            `;
        });

        // abrir modal
        const modal = new bootstrap.Modal(
            document.getElementById("editarCompraModal")
        );

        modal.show();

    } catch (error) {
        console.error(error);
        await alertError("Error al cargar la compra");
    }
}

async function actualizarCompra() {

    try {

        const id = document.getElementById("editarCompraId").value;
        const id_estado = document.getElementById("editarCompraEstado").value;

        const res = await fetch(`${API_URL}/api/compras/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ id_estado })
        });

        const data = await res.json();

        if (!res.ok) {
            await alertError(data.message || "Error al actualizar compra");
            return;
        }

        await alertSuccess("Estado de la compra actualizado");

        // cerrar modal
        const modalEl = document.getElementById("editarCompraModal");
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();

        // refrescar tabla
        cargarCompras();

    } catch (error) {
        console.error(error);
        await alertError("Error de conexión al actualizar compra");
    }
}

async function buscarCompras() {
    try {

        const valorBusqueda = document.getElementById("inputBusquedaCompra").value.trim();
        const proveedor = document.getElementById("filtroProveedorCompra").value;
        const estado = document.getElementById("filtroEstado").value;

        let response;

        // BUSQUEDA POR ID (prioridad)
        if (valorBusqueda !== "" && !isNaN(valorBusqueda)) {
            response = await fetch(
                `${API_URL}/api/compras/${valorBusqueda}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

        } else {

            //  FILTROS COMBINADOS
            const params = new URLSearchParams();

            if (valorBusqueda !== "") {
                params.append("id_compra", valorBusqueda);
            }

            if (proveedor !== "") {
                params.append("proveedor", proveedor);
            }

            if (estado !== "") {
                params.append("estado", estado);
            }

            response = await fetch(
                `${API_URL}/api/compras/filtros?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
        }

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
        }

        const data = await response.json();

        const compras = Array.isArray(data.data)
            ? data.data
            : [data.data];

        if (compras.length === 0) {
            alertError("Sin resultados", "No se encontraron compras");
            mostrarCompras([]);
            return;
        }

        mostrarCompras(compras);

        // limpiar filtros
        document.getElementById("inputBusquedaCompra").value = "";
        document.getElementById("filtroProveedorCompra").value = "";
        document.getElementById("filtroEstado").value = "";

    } catch (error) {
        console.error(error);
        alertError("Error al buscar compras");
    }
}

function mostrarCompras(compras) {

    const tbody = document.getElementById("tablaCompras");

    if (!tbody) return;

    tbody.innerHTML = "";
    compras.forEach(co => {
        let badgeEstado = "";
        switch (co.estado) {

            case "Pendiente":
                badgeEstado =
                    '<span class="badge bg-secondary">Pendiente</span>';
                break;

            case "En proceso":
                badgeEstado =
                    '<span class="badge bg-warning text-dark">En proceso</span>';
                break;

            case "Completado":
                badgeEstado =
                    '<span class="badge bg-success">Completado</span>';
                break;

            default:
                badgeEstado =
                    '<span class="badge bg-danger">Cancelado</span>';
        }

        tbody.innerHTML += `
            <tr>
                <td>${co.id_compra}</td>
                <td>${new Date(co.fecha).toLocaleDateString("es-AR")}</td>
                <td>${co.proveedor}</td>
                <td>${co.usuario_HizoCompra}</td>
                <td>${co.sucursal}</td>
                <td>$${Number(co.total).toFixed(2)}</td>
                <td>${badgeEstado}</td>
                <td class="acciones_acciones">

                    <button
                        class="btn btn-sm btn-editarCompra btneditar"
                        data-id="${co.id_compra}">
                        Editar
                    </button>

                    <button
                        class="btn btn-sm btn-verCompra"
                        data-id="${co.id_compra}">
                        <i class="bi bi-eye"></i>
                    </button>

                </td>
            </tr> `;
    });

}

//funcion limpiar filtros
async function limpiarFiltrosCompras() {

    document.getElementById("inputBusquedaCompra").value = "";
    document.getElementById("filtroProveedorCompra").value = "";
    document.getElementById("filtroEstado").value = "";



}

//-*-*-*-*-*PEDIDOS *-*-*-*-*-*-

    let detallePedidos = [];
    let stockDisponibleActual = 0;

// TRAER Pedidos
async function cargarPedidos() {

    try {

        const res = await fetch(`${API_URL}/api/pedidos`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        const tbody = document.getElementById("tablaPedidos");

        if (!tbody) return;

        tbody.innerHTML = "";

        data.data.forEach(pe => {

            let badgeEstado = "";

            switch (pe.estado) {
                case "Pendiente":
                    badgeEstado ='<span class="badge bg-secondary">Pendiente</span>';
                    break;

                case "En proceso":
                    badgeEstado ='<span class="badge bg-warning text-dark">En proceso</span>';
                    break;

                case "Completado":
                    badgeEstado ='<span class="badge bg-success">Completado</span>';
                    break;

                default:
                    badgeEstado ='<span class="badge bg-danger">Cancelado</span>';
            }

            tbody.innerHTML += `
            <tr>
                <td>${pe.id_pedido}</td>
                <td>${new Date(pe.fecha).toLocaleDateString("es-AR")}</td>
                <td>${pe.nombre_cliente}</td>
                <td>${pe.usuario_tomoPedido}</td>
                <td>${pe.sucursal}</td>
                <td>$${pe.total}</td>
                <td>${badgeEstado}</td>
                <td class="acciones_acciones">
                    <button
                        class="btn btn-sm btn-editarPedido btneditar"
                        data-id="${pe.id_pedido}">
                        Editar
                    </button>
                    <button
                        class="btn btn-sm btn-verPedido"
                        data-id="${pe.id_pedido}">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            </tr>`;
        });

    } catch (error) {
        console.error("Error cargando compras:", error);
    }
}

//Funcion cargar Clientes Filtro
async function cargarClientesFiltroPedido() {

    try {
        const res = await fetch(`${API_URL}/api/clientes`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });

        const data = await res.json();

        const select = document.getElementById("filtroClientePedido");

        if(!select) return;
        select.innerHTML =
            `<option value="">Todos</option>`;

        data.data.forEach(cl => {
            select.innerHTML += `
                <option value="${cl.id_cliente}">${cl.nombre}</option>`;
        });

    } catch(error){
        console.error(error);
    }
}

async function cargarClientesModalPedido() {

    try {
        const res = await fetch(`${API_URL}/api/clientes`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        const select = document.getElementById("clientePedidoModal");
        if (!select) return;

        select.innerHTML = `<option value="">Seleccionar Cliente</option>`;

        data.data.forEach(cl => {
            select.innerHTML += `
                <option value="${cl.id_cliente}">
                    ${cl.nombre}
                </option>`;
        });

    } catch (error) {
        console.error(error);
    }
}

//carga de productos del modal de nuevo pedido
async function cargarProductosModalPedido() {
    try {
        const res = await fetch(`${API_URL}/api/productos`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        const select = document.getElementById("productoPedido");
        if (!select) return;

        select.innerHTML = `<option value="">Seleccionar producto</option>`;

        data.data.forEach(p => {
        select.innerHTML += `
            <option 
            value="${p.id_producto}">
            ${p.nombre}
            </option>`;
        });

    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

//Modal Nuevo Pedido
function abrirModalNuevoPedido() {

    cargarClientesModalPedido();
    cargarProductosModalPedido();


    // limpiar productos 
    const select = document.getElementById("productoPedido");
    if (select) {
        select.innerHTML = `<option value="">Seleccionar producto</option>`;
    }

    document.querySelector("#pedidoModal .modal-title").innerText = "Nuevo Pedido";
    document.querySelector("#pedidoModal .modalIcon").className =
        "modalIcon bi bi-cart-plus icon-modal";

    const modal = new bootstrap.Modal(document.getElementById("pedidoModal"));
    modal.show();
}

//Funcion cargar precio del producto en modal de pedido
async function cargarPrecioModalPedido(idProducto) {

    try{
        if(!idProducto) {
            Document.getElementById("precioUnitarioPedido").value = "";
            return;
        }

        const res = await fetch (
            `${API_URL}/api/productos/${idProducto}`,
            {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await res.json();
            if(!res.ok){
            throw new Error(data.message);
            }

            document.getElementById("precioUnitarioPedido").value = 
            Number(data.data.precio).toFixed(2);

    }catch (error){
        console.error(error);

    }
    
}

//funcion cargar la cantidad disponible del producto
async function cargarDisponibilidadProducto(idProducto){
        try {

        const res = await fetch(
            `${API_URL}/api/stock/producto/${idProducto}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message);
        }
        
        stockDisponibleActual = data.data.cantidad_disponible;
        const inputCantidad = document.getElementById("cantidadPedido");

       // Mostrar disponibilidad
        document.getElementById("stockDisponiblePedido").innerHTML =
            `Disponibles: <strong>${stockDisponibleActual}</strong> unidades`;

        // Limitar cantidad máxima
        inputCantidad.max = stockDisponibleActual;
        inputCantidad.dataset.disponible = stockDisponibleActual;

        // Si no hay stock, limpiar el campo
        if (stockDisponibleActual <= 0) {
            inputCantidad.value = "";
        }

    } catch (error) {
        console.error(error);
    }
}

// calcular subtotal: 
function calcularSubtotalPedido() {

    const cantidad =
        parseFloat(document.getElementById("cantidadPedido").value) || 0;

    const precio =
        parseFloat(document.getElementById("precioUnitarioPedido").value) || 0;

    document.getElementById("subtotalPedido").value =
        (cantidad * precio).toFixed(2);
}

function renderDetallePedido() {

    const tbody = document.getElementById("tablaDetallePedido");
    console.log(tbody);
    tbody.innerHTML = "";

    detallePedidos.forEach((item, index) => {

        tbody.innerHTML += `
            <tr>
                <td>${item.nombreProducto}</td>
                <td>${item.cantidad}</td>
                <td>${item.precio.toFixed(2)}</td>
                <td>${item.subtotal.toFixed(2)}</td>
                <td>
                    <button
                        class="btn btn-danger btn-sm btnEliminarItemPedido"
                        data-index="${index}">
                        <i class="bi bi-trash"></i>
                    </button
                </td>
            </tr>
        `;
    });
}

function calcularTotalPedido() {

    const total = detallePedidos.reduce((acc, item) => acc + item.subtotal, 0);

    document.getElementById("totalPedido").value = total.toFixed(2);
}
 //limpiar inputs de detalle compra
function limpiarInputsProductoPedido() {
    document.getElementById("cantidadPedido").value = "";
    document.getElementById("precioUnitarioPedido").value = "";
    document.getElementById("subtotalPedido").value = "";
}

// Agregar productos a la lista del pedido
function agregarProductoPedido() {

    console.log("Entró a agregarProductoPedido");

    const selectProducto = document.getElementById("productoPedido");
    const idProducto = selectProducto.value;
    const nombreProducto =
        selectProducto.options[selectProducto.selectedIndex]?.text;

    const cantidad =
        parseFloat(document.getElementById("cantidadPedido").value) || 0;

    const precio =
        parseFloat(document.getElementById("precioUnitarioPedido").value) || 0;

    const subtotal =
        parseFloat(document.getElementById("subtotalPedido").value) || 0;

    // Validaciones básicas
    if (!idProducto || cantidad <= 0 || precio <= 0) {
        alertError("Completa producto, cantidad y precio");
        return;
    }

    // Sin stock
    if (stockDisponibleActual <= 0) {
        alertError("Este producto no posee stock disponible.");
        return;
    }

    // La cantidad supera el stock disponible
    if (cantidad > stockDisponibleActual) {
        alertError(
            `Solo hay ${stockDisponibleActual} unidades disponibles para este producto.`
        );
        return;
    }

    // Verificar si el producto ya fue agregado al pedido
    const existe = detallePedidos.find(
        p => p.idProducto == idProducto
    );

    if (existe) {
        // Validar que la suma no supere el stock
        if ((existe.cantidad + cantidad) > stockDisponibleActual) {
            alertError(`Solo hay ${stockDisponibleActual} unidades disponibles para este producto.`);
            return;
        }

        existe.cantidad += cantidad;
        existe.subtotal = existe.cantidad * existe.precio;

    } else {

        detallePedidos.push({
            idProducto,
            nombreProducto,
            cantidad,
            precio,
            subtotal
        });

    }

    renderDetallePedido();
    calcularTotalPedido();
    limpiarInputsProductoPedido();
}
 //Funcion eliminar items de la lista del pedido
function eliminarItemPedido(index) {

    detallePedidos.splice(index, 1);

    renderDetallePedido();

    calcularTotalPedido();
}

function obtenerPedidoFormulario() {

    return {

        id_cliente:
            parseInt(document.getElementById("clientePedidoModal").value),

        id_usuario: parseInt(idUsuario),

        id_sucursal:
            parseInt(document.getElementById("sucursalPedido").value),

        id_estado:
            parseInt(document.getElementById("pedidoEstado").value),

        total:
            parseFloat(document.getElementById("totalPedido").value) || 0,

        productos: detallePedidos.map(item => ({
            id_producto: parseInt(item.idProducto),
            cantidad: item.cantidad,
            precio_unitario: item.precio
        }))
    };
}
 //Funcion ceerar modal nuevo pedido
function cerrarModalPedido() {

    const modal = bootstrap.Modal.getInstance(
        document.getElementById("pedidoModal")
    );

    if (modal) {
        modal.hide();
    }

    document.getElementById("pedidoId").value = "";
    document.getElementById("clientePedidoModal").innerHTML = `<option value="">Seleccionar cliente</option>`;
    document.getElementById("productoPedido").innerHTML = `<option value="">Seleccionar producto</option>`;
    document.getElementById("cantidadPedido").value = "";
    document.getElementById("precioUnitarioPedido").value = "";
    document.getElementById("subtotalPedido").value = "";
    document.getElementById("totalPedido").value = "";

    detallePedidos = [];

    renderDetallePedido();
}
async function guardarPedido() {

    try {

        const id = document.getElementById("pedidoId").value;
        const pedido = obtenerPedidoFormulario();
        const url = id
            ? `${API_URL}/api/pedidos/${id}`
            : `${API_URL}/api/pedidos`;

        const method = id ? "PUT" : "POST";
        const res = await fetch(url, {

            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(pedido)
        });

        const data = await res.json();

        if (!res.ok) {
            await alertError(
                data.message || "Error al guardar pedido"
            );
        return;
        }
        await alertSuccess(
            id ? "Pedido actualizado" : "Pedido creado"
        );

        cerrarModalPedido();
        await cargarPedidos();

    }

    catch (error) {
        console.error(error);
        alertError("Error de conexión");
    }
}

//Funcion mostral el modal de detalle de cada pedido
function mostrarModalDetallePedido(productos) {

    const tbody = document.getElementById("tablaDetallePedidoVer");

    tbody.innerHTML = "";

    productos.forEach(p => {

        tbody.innerHTML += `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.cantidad}</td>
                <td>$${p.precio_unitario}</td>
                <td>$${p.subtotal}</td>
            </tr>
        `;
    });

    new bootstrap.Modal(
        document.getElementById("detallePedidoModal")
    ).show();
}

//Funcion ver detalle pedido
async function verDetallePedido(id) {

    try {
            const res = await fetch(`${API_URL}/api/pedidos/${id}/detalle`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();
        mostrarModalDetallePedido(data.data);

    } catch(error) {
        console.error(error);
        alertError("No se pudo cargar el detalle");

    }

}

// Función Editar estado Pedido
async function editarPedido(id) {

    try {

        // pedido general
        const resPedido = await fetch(
            `${API_URL}/api/pedidos/${id}`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        const dataPedido = await resPedido.json();

        if (!resPedido.ok) {
            await alertError(dataPedido.message);
            return;
        }

        const pedido = dataPedido.data;

        // VALIDACIÓN PRIMERO (regla de negocio)
        if (pedido.estado?.toLowerCase() === "completado") {
            await alertError("El estado ya está completado. No se puede editar este pedido.");
            return;
        }

        // 2. detalle productos (solo si se puede editar)
        const resDetalle = await fetch(
            `${API_URL}/api/pedidos/${id}/detalle`,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );

        const dataDetalle = await resDetalle.json();

        if (!resDetalle.ok) {
            await alertError(dataDetalle.message);
            return;
        }

        // ===== CABECERA -----
        document.getElementById("editarPedidoId").value = pedido.id_pedido;
        document.getElementById("editarPedidoCliente").value = pedido.nombre_cliente;
        document.getElementById("editarPedidoSucursal").value = pedido.sucursal;
        document.getElementById("editarPedidoFecha").value = pedido.fecha?.substring(0, 10);
        document.getElementById("editarPedidoTotal").value = pedido.total;
        document.getElementById("editarPedidoEstado").value = pedido.id_estado;

        // ----- DETALLE ----
        const tbody = document.getElementById("tablaEditarDetallePedido");
        tbody.innerHTML = "";

        dataDetalle.data.forEach(p => {

            tbody.innerHTML += `
                <tr>
                    <td>${p.nombre}</td>
                    <td>${p.cantidad}</td>
                    <td>${Number(p.precio_unitario).toFixed(2)}</td>
                    <td>${Number(p.subtotal).toFixed(2)}</td>
                </tr>
            `;
        });

        // abrir modal
        const modal = new bootstrap.Modal(
            document.getElementById("editarPedidoModal")
        );

        modal.show();

    } catch (error) {
        console.error(error);
        await alertError("Error al cargar el pedido");
    }
}

async function actualizarPedido() {

    try {

        const id = document.getElementById("editarPedidoId").value;
        const id_estado = document.getElementById("editarPedidoEstado").value;

        const res = await fetch(`${API_URL}/api/pedidos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ id_estado })
        });

        const data = await res.json();

        if (!res.ok) {
            await alertError(data.message || "Error al actualizar pedido");
            return;
        }

        await alertSuccess("Estado del pedido actualizado");

        // cerrar modal
        const modalEl = document.getElementById("editarPedidoModal");
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();

        // refrescar tabla
        cargarPedidos();

    } catch (error) {
        console.error(error);
        await alertError("Error de conexión al actualizar pedido");
    }
}

async function buscarPedidos() {
    try {

        const valorBusqueda = document.getElementById("inputBusquedaPedido").value.trim();
        const cliente = document.getElementById("filtroClientePedido").value;
        const estado = document.getElementById("filtroEstadoPedido").value;

        let response;

        // BUSQUEDA POR ID (prioridad)
        if (valorBusqueda !== "" && !isNaN(valorBusqueda)) {
            response = await fetch(
                `${API_URL}/api/pedidos/${valorBusqueda}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

        } else {

            //  FILTROS COMBINADOS
            const params = new URLSearchParams();

            if (valorBusqueda !== "") {
                params.append("id_pedido", valorBusqueda);
            }

            if (cliente !== "") {
                params.append("nombre_cliente", cliente);
            }

            if (estado !== "") {
                params.append("estado", estado);
            }

            response = await fetch(
                `${API_URL}/api/pedidos/filtros?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
        }

        if (response.status === 404) {
            await alertError("Sin resultados","No se encontró ningún pedido con ese ID.");
            mostrarPedidos([]);
            return;
        }

        if (!response.ok) {
            throw new Error(`Error HTTP ${response.status}`);
        }

        const data = await response.json();

        const pedidos = Array.isArray(data.data)
            ? data.data
            : [data.data];

        if (pedidos.length === 0) {
            alertError("Sin resultados", "No se encontraron pedidos");
            mostrarPedidos([]);
            return;
        }

        mostrarPedidos(pedidos);

        // limpiar filtros
        document.getElementById("inputBusquedaPedido").value = "";
        document.getElementById("filtroClientePedido").value = "";
        document.getElementById("filtroEstadoPedido").value = "";

    } catch (error) {
        console.error(error);
        alertError("Error al buscar pedidos");
    }
}

function mostrarPedidos(pedidos) {

    const tbody = document.getElementById("tablaPedidos");

    if (!tbody) return;

    tbody.innerHTML = "";
    pedidos.forEach(pe => {
        let badgeEstado = "";
        switch (pe.estado) {

            case "Pendiente":
                badgeEstado =
                    '<span class="badge bg-secondary">Pendiente</span>';
                break;

            case "En proceso":
                badgeEstado =
                    '<span class="badge bg-warning text-dark">En proceso</span>';
                break;

            case "Completado":
                badgeEstado =
                    '<span class="badge bg-success">Completado</span>';
                break;

            default:
                badgeEstado =
                    '<span class="badge bg-danger">Cancelado</span>';
        }

        tbody.innerHTML += `
            <tr>
                <td>${pe.id_pedido}</td>
                <td>${new Date(pe.fecha).toLocaleDateString("es-AR")}</td>
                <td>${pe.nombre_cliente}</td>
                <td>${pe.usuario_tomoPedido}</td>
                <td>${pe.sucursal}</td>
                <td>$${Number(pe.total).toFixed(2)}</td>
                <td>${badgeEstado}</td>
                <td class="acciones_acciones">

                    <button
                        class="btn btn-sm btn-editarPedido btneditar"
                        data-id="${pe.id_pedido}">
                        Editar
                    </button>

                    <button
                        class="btn btn-sm btn-verPedido"
                        data-id="${pe.id_pedido}">
                        <i class="bi bi-eye"></i>
                    </button>

                </td>
            </tr> `;
    });

}

//funcion limpiar filtros
async function limpiarFiltrosPedidos() {

    document.getElementById("inputBusquedaPedidos").value = "";
    document.getElementById("filtroClientePedido").value = "";
    document.getElementById("filtroEstadoPedido").value = "";



}

//-*-*-*-*-*-*-UBICACIONES: CIUADES Y PROVINCIAS -*-*-*-*-*-*-*-
function mostrarModuloUbicaciones(modulo){

    document.getElementById("provinciasSection").classList.add("d-none");

    document.getElementById("ciudadesSection").classList.add("d-none");

    if(modulo==="provincias"){

        document.getElementById("provinciasSection").classList.remove("d-none");
        cargarProvincias();

    }else{

        document.getElementById("ciudadesSection").classList.remove("d-none");
        cargarCiudades();

    }

}
function mostrarProvincias(provincias) {
    const tbody = document.getElementById("tablaProvincias");

    if (!tbody) return;

    tbody.innerHTML = "";

    provincias.forEach(p => {

        tbody.innerHTML += `
            <tr>
                <td>${p.id_provincia}</td>
                <td>${p.nombre}</td>

                <td>
                    <button
                        class="btn btn-sm btn-editarProvincia btneditar"
                        data-id="${p.id_provincia}">
                        Editar
                    </button>

                    <button
                        class="btn btn-sm btn-eliminarProvincia btneliminar"
                        data-id="${p.id_provincia}">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;

    });

}
function mostrarCiudades(ciudades) {

    const tbody = document.getElementById("tablaCiudades");

    if (!tbody) return;

    tbody.innerHTML = "";

    ciudades.forEach(c => {

        tbody.innerHTML += `
            <tr>
                <td>${c.id_ciudad}</td>
                <td>${c.nombre}</td>
                <td>${c.provincia}</td>

                <td>
                    <button
                        class="btn btn-sm btn-editarCiudad btneditar"
                        data-id="${c.id_ciudad}">
                        Editar
                    </button>

                    <button
                        class="btn btn-sm btn-eliminarCiudad btneliminar"
                        data-id="${c.id_ciudad}">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;

    });

}

async function cargarCiudades() {
    try {
        const response = await fetch(`${API_URL}/api/ciudades`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const repuesta = await response.json();

        if (!response.ok) {
            throw new Error(repuesta.message);
        }

        mostrarCiudades(repuesta.data);

    } catch (error) {

        console.error(error);
        alertError("Error al cargar ciudades");
    }

}

//funcion cargar provincias
async function cargarProvincias() {

    try {
        const response = await fetch(`${API_URL}/api/provincias`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const rta = await response.json();

        if (!response.ok) {
            throw new Error(rta.message);
        }

        mostrarProvincias(rta.data);

    } catch (error) {

        console.error(error);
        alertError("Error al cargar provincias");
    }

}

//FUNCION ELIMINAR PROVINCIA
async function eliminarProvincia(id) {
    try{ // manejo de bloque 
        const confirmar = await confirmDelete("¿Seguro que querés eliminar esta provincia?"); //muestra un poup del navegador con mensaje

        if (!confirmar.isConfirmed) return;
        const res = await fetch(`${API_URL}/api/provincias/${id}/eliminar`, { //peticion al backend
            method: "PATCH",
            headers: { // cabecera HTTP, metaddata del la request
                "Content-Type": "application/json", //lo que se envia es json
                "Authorization": `Bearer ${token}` //envio del token (Bearer es el esquema de autenticacion y token esta guardado en el localStorage)
            }
        });
        const data = await res.json(); //convierte la repuesta del backend en un objeto JS

        if(!res.ok){ //si hay error muestra el mensaje
            await alertError(data.message || "Error al eliminar provincia");
            return; //corta la ejecucion si hubo error
        }

        await alertSuccess(data.message); //mensaje de exito

        //refrescar tabla
        cargarProvincias();

    }catch (error){ //captura el error
        console.error("Error eliminando provincia:", error); //mensaje debbug
        await alertError("Error de conexión con el servidor");
    }
};

//FUNCION MOSTRAR FORMULARIO NUEVA PROVINCIA
function abrirModalNuevaProvincia() {

    // limpiar formulario
    document.getElementById("nombreprov").value = "";

    // cambiar título
    document.querySelector("#provinciaModal .modal-title").innerText = "Nueva Provincia";

    document.querySelector("#provinciaModal .modalIcon").className = "modalIcon bi bi-map icon-modal";

    // abrir modal
    const modal = new bootstrap.Modal(document.getElementById("provinciaModal"));
    modal.show();
}

function cerrarModalProvincia() {

    const modalEl = document.getElementById("provinciaModal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    modal.hide();

    //Limpiar el input
    document.getElementById("nombreprov").value = "";
}

//Funcion guardar provincia: post, put
async function guardarProvincia() {

    try {

        const id = document.getElementById("provinciaId").value;
        const nombre_provincia = document.getElementById("nombreprov").value.trim();

        const url = id
            ? `${API_URL}/api/provincias/${id}`
            : `${API_URL}/api/provincias`;

        const method = id ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({nombre: nombre_provincia})
        });

        const data = await res.json();

        if (!res.ok) {
            await alertError(data.message || "Error al guardar provincia");
            return;
        }

        await alertSuccess(id ? "Provincia actualizada" : "Provincia creada");

        cerrarModalProvincia();
        cargarProvincias();

    } catch (error) {
        console.error(error);
        alert("Error de conexión");
    }
}

//FUNCION EDITAR PROVINCIA
async function editarProvincia(id) {

    try {
        const res = await fetch(`${API_URL}/api/provincias/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!res.ok || !data?.data) {
            await alertError(data.message || "Error al obtener provincia");
            return;
        }

        const prov = data.data;

        // ID oculto
        document.getElementById("provinciaId").value = prov.id_provincia;

        // Campo
        document.getElementById("nombreprov").value = prov.nombre;
        
        // título dinámico
        document.querySelector("#provinciaModal .modal-title").innerText = "Editar Provincia";

        document.querySelector("#provinciaModal .modalIcon").className ="modalIcon bi bi-pencil-square icon-modal";

        // abrir modal
        const modalEl = document.getElementById("provinciaModal");
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();

    } catch (error) {
        console.error(error);
        await alertError("Error de conexión con el servidor");
    }
}

//FUNCION ELIMINAR CIUDAD
async function eliminarCiudad(id) {
    try{ // manejo de bloque 
        const confirmar = await confirmDelete("¿Seguro que querés eliminar esta ciudad?"); //muestra un poup del navegador con mensaje

        if (!confirmar.isConfirmed) return;
        const res = await fetch(`${API_URL}/api/ciudades/${id}/eliminar`, { //peticion al backend
            method: "PATCH",
            headers: { // cabecera HTTP, metaddata del la request
                "Content-Type": "application/json", //lo que se envia es json
                "Authorization": `Bearer ${token}` //envio del token (Bearer es el esquema de autenticacion y token esta guardado en el localStorage)
            }
        });
        const data = await res.json(); //convierte la repuesta del backend en un objeto JS

        if(!res.ok){ //si hay error muestra el mensaje
            await alertError(data.message || "Error al eliminar ciudad");
            return; //corta la ejecucion si hubo error
        }

        await alertSuccess(data.message); //mensaje de exito

        //refrescar tabla
        cargarCiudades();

    }catch (error){ //captura el error
        console.error("Error eliminando ciudad:", error); //mensaje debbug
        await alertError("Error de conexión con el servidor");
    }
};

//FUNCION MOSTRAR FORMULARIO NUEVA PROVINCIA
async function abrirModalNuevaCiudad() {

    // limpiar formulario
    document.getElementById("ciudadId").value = "";
    document.getElementById("provinciaciudad").value = "";
    document.getElementById("nombreciudad").value = "";

    await cargarProvinciasSelect();

    // cambiar título
    document.querySelector("#ciudadModal .modal-title").innerText = "Nueva Ciudad";

    document.querySelector("#ciudadModal .modalIcon").className = "modalIcon bi bi-geo icon-modal";

    // abrir modal
    const modal = new bootstrap.Modal(document.getElementById("ciudadModal"));
    modal.show();
}

function cerrarModalCiudad() {

    const modalEl = document.getElementById("ciudadModal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);

    modal.hide();

    //Limpiar los inputs
    document.getElementById("ciudadId").value = "";
    document.getElementById("provinciaciudad").value = "";
    document.getElementById("nombreciudad").value = "";
}

//Funcion guardar ciudad: post, put
async function guardarCiudad() {

    try {

        const id = document.getElementById("ciudadId").value;
        const id_provincia = parseInt(document.getElementById("provinciaciudad").value);
        const nombre = document.getElementById("nombreciudad").value.trim();

        const url = id
            ? `${API_URL}/api/ciudades/${id}`
            : `${API_URL}/api/ciudades`;

        const method = id ? "PUT" : "POST";

        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                nombre,
                id_provincia
            })
        });

        const data = await res.json();

        if (!res.ok) {
            await alertError(data.message || "Error al guardar ciudad");
            return;
        }

        await alertSuccess(id ? "Ciudad actualizada" : "Ciudad creada");

        cerrarModalCiudad();
        cargarCiudades();

    } catch (error) {
        console.error(error);
        alert("Error de conexión");
    }
}

// Cargar provincias en el select del modal de ciudades
async function cargarProvinciasSelect() {
    try {
        const res = await fetch(`${API_URL}/api/provincias`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message);
        }

        const select = document.getElementById("provinciaciudad");

        select.innerHTML = `
            <option value="">Seleccionar provincia</option>`;

        data.data.forEach(provincia => {
            select.innerHTML += `
                <option value="${provincia.id_provincia}">${provincia.nombre}</option>`;
        });

    } catch (error) {
        console.error(error);
        alertError("Error al cargar provincias");
    }

}
// FUNCION EDITAR CIUDAD
async function editarCiudad(id) {

    try {

        const res = await fetch(`${API_URL}/api/ciudades/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!res.ok || !data?.data) {
            await alertError(data.message || "Error al obtener ciudad");
            return;
        }

        const ciudad = data.data;

        // Cargar provincias en el select
        await cargarProvinciasSelect();

        // ID oculto
        document.getElementById("ciudadId").value = ciudad.id_ciudad;

        // Nombre
        document.getElementById("nombreciudad").value = ciudad.nombre;

        // Provincia
        document.getElementById("provinciaciudad").value = ciudad.id_provincia;

        // Título
        document.querySelector("#ciudadModal .modal-title").innerText = "Editar Ciudad";
        document.querySelector("#ciudadModal .modalIcon").className = "modalIcon bi bi-pencil-square icon-modal";

        // Abrir modal
        const modalEl = document.getElementById("ciudadModal");
        const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();

    } catch (error) {
        console.error(error);
        await alertError("Error de conexión con el servidor");

    }
}

//--*-**-*-*-*---Tarjetas y resumen PANEL ---*-*-*-*---*-**-
// Cargar dashboard
async function cargarDashboard(){
    try {
        const respuesta = await fetch(
            `${API_URL}/api/panel/dashboard`,
            {
                method: "GET",
                headers:{
                    "Authorization": `Bearer ${token}`,
                    "Content-Type":"application/json"
                }
            }
        );

        if(!respuesta.ok){
            throw new Error("No se pudo cargar el dashboard");
        }

        const resultado = await respuesta.json();
        mostrarEstadisticas(resultado.data.estadisticas);
        mostrarMonitor(resultado.data.monitor, resultado.data.estadisticas);
        mostrarActividad( resultado.data.actividad);

    } catch(error){
        console.error("Error dashboard:",error);

    }

}
 //cards superiores
function mostrarEstadisticas(datos){
    document.getElementById("stockTotal").textContent =Number(datos.stock_total).toLocaleString("es-AR");
    document.getElementById("usuariosActivos").textContent = datos.usuarios_activos;
    document.getElementById("pedidosPendientes").textContent = datos.pedidos_pendientes;
    document.getElementById("clientesRegistrados").textContent = datos.clientes_registrados;

}
 //monitor
function mostrarMonitor(monitor, estadisticas){

    document.getElementById("monitorStockCritico").textContent = monitor.stock_critico;
    document.getElementById("monitorProductos").textContent = monitor.total_productos;
    document.getElementById("monitorPedidos").textContent = monitor.pedidos_espera;
    document.getElementById("monitorUsuarios").textContent = estadisticas.usuarios_activos;

    // Barras
    document.getElementById("barraStockCritico").style.width = `${(monitor.stock_critico / monitor.total_productos) * 100}%`;

    document.getElementById("barraInventario").style.width = "100%";

    document.getElementById("barraPedidos").style.width =`${(estadisticas.pedidos_pendientes / 20) * 100}%`;

    document.getElementById("barraUsuarios").style.width = `${(estadisticas.usuarios_activos / 20) * 100}%`;

}
//Lista de actividad
function mostrarActividad(datos) {

    const lista = document.getElementById("listaActividad");
    lista.innerHTML = "";

    datos.forEach(item => {

        let icono = "";
        let claseIcono = "";
        let claseBadge = "";
        let badge = "";

        if (item.tipo === "pedido") {
            icono = "bi-receipt";
            claseIcono = "icon-primary";
            claseBadge = "badge-primary";
            badge = "PEDIDO";
        } else {
            icono = "bi-box-seam";
            claseIcono = "icon-warning";
            claseBadge = "badge-info";
            badge = "COMPRA";
        }

        lista.innerHTML += `
            <div class="activity-item">

                <div class="activity-icon ${claseIcono}">
                    <i class="bi ${icono}"></i>
                </div>

                <div class="activity-content">
                    <h6>${item.titulo}</h6>
                    <small>
                        ${item.detalle} • ${new Date(item.fecha).toLocaleString("es-AR")}
                    </small>
                </div>

                <span class="activity-badge ${claseBadge}">${badge}</span>
            </div>`;
    });
}

# Pharma Supply Manager

Sistema de gestión de cadena de suministro farmacéutica desarrollado con
**Node.js**, **Express** y **MySQL**, que permite administrar productos,
proveedores, clientes, pedidos, stock y usuarios dentro del entorno
farmacéutico.

El proyecto está orientado a mejorar la **trazabilidad**, **seguridad**,
**control de acceso** y la **eficiencia operativa** mediante una API
REST modular, escalable y protegida.

## 🚀 **Características principales**

✔️ API REST organizada por módulos (modelos, servicios, controladores,
rutas)\
✔️ Autenticación con **JWT**\
✔️ Autorización mediante **roles**:\
- **Administrador**\
- **Gerente**\
- **Empleado**\
✔️ Sistema de logs con **Winston**\
✔️ Contraseñas encriptadas con **bcrypt**\
✔️ Tests unitarios con **Jest**\
✔️ Conexión a base de datos **MySQL**\
✔️ Deploy completo en **Railway**\
✔️ Rutas protegidas según permisos\
✔️ Manejo de errores y validaciones\
✔️ Middlewares personalizados\
✔️ CORS habilitado

## 🛠️ **Tecnologías utilizadas**

### **Backend**

-   Node.js\
-   Express\
-   MySQL\
-   dotenv\
-   Nodemon

### **Seguridad**

-   **JWT** (autenticación)\
-   **bcrypt** (encriptación de contraseñas)\
-   Permisos y middleware para **roles**

### **Logs**

-   **Winston** para registrar errores, accesos y eventos del sistema

### **Testing**

-   Framework **Jest**\
-   Tests ubicados en la carpeta `/tests`

### **Deploy**

-   **Railway** (API host + base de datos remota)

## 🔐 **Autenticación y Roles**

El sistema implementa autenticación mediante **JSON Web Tokens (JWT)**:

-   Los usuarios se loguean con email + contraseña\
-   Se genera un token firmado\
-   Se utiliza middleware para validar el token en rutas protegidas

### **Autorización por roles**

Se implementan permisos basados en roles para restringir acciones:

  --------------------------------------------------------------------------
  Rol             Permisos principales
  --------------- ----------------------------------------------------------
  Administrador   CRUD total, usuarios, gestión completa

  Gerente         Gestión de stock, pedidos y clientes, productos

  Empleado        Consultas, carga básica de datos, tareas operativas
  --------------------------------------------------------------------------

Middleware utilizado (ejemplo):\
`checkRole("admin")`, `checkRole("gerente")`, `checkRole("empleado")`

## 📂 **Estructura del proyecto**

    ├── src
    │   ├── controllers
    │   ├── models
    │   ├── routes
    │   ├── services
    │   ├── middlewares
    │   ├── config
    │   └── index.js
    ├── tests
    ├── package.json
    └── README.md

## ⚙️ **Instalación y ejecución**

### 1. Clonar el repositorio

``` bash
git clone https://github.com/Ctesando-hub/Pharma-Supply-Manager.git
```

### 2. Instalar dependencias

``` bash
npm install
```

### 3 Configurar variables de entorno

Crear archivo `.env`:

``` env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=**********
DB_NAME=pharma
JWT_SECRET=miClaveSecreta
PORT=3000
```

### 4. Ejecutar servidor en modo desarrollo

``` bash
npm run dev
```

### 5. Ejecutar tests unitarios

``` bash
npm test
```

## 🧪 **Tests unitarios con Jest**

El sistema incluye pruebas para:

-   Servicios
-   Lógica de negocio (hash de contraseñas, mapping de datos)
-   Comportamiento de funciones internas
-   Validaciones

Reporte típico:

    Test Suites: 2 passed, 2 total
    Tests:       2 passed, 2 total

## ☁️ **Deploy en Railway**

La API se encuentra desplegada en Railway con:

-   Variables de entorno configuradas\
-   Base de datos MySQL remota\
-   Logs de Winston en ejecución\
-   Rutas protegidas con autenticación\
-   Endpoint público listo para consumir

## 👩‍💻 **Autora**

**Carolina Tesando**\
Estudiante de Tecnicatura Superior en Desarrollo de Software -- IFTS 24\
Apasionada por el desarrollo backend, bases de datos y soluciones
eficientes.

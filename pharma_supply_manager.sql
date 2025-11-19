-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-11-2025 a las 17:44:12
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pharma_supply_manager`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudades`
--

CREATE TABLE `ciudades` (
  `id_ciudad` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `id_provincia` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ciudades`
--

INSERT INTO `ciudades` (`id_ciudad`, `nombre`, `id_provincia`) VALUES
(1, 'Río Cuarto', 1),
(2, 'Córdoba', 1),
(3, 'Rosario', 3),
(4, 'Santa Fe', 3),
(5, 'Mendoza', 4),
(6, 'Buenos Aires', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `cuit` varchar(15) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `id_ciudad` int(11) DEFAULT NULL,
  `id_tipo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `nombre`, `cuit`, `telefono`, `direccion`, `email`, `id_ciudad`, `id_tipo`) VALUES
(1, 'Hospital San Martín', '30-71234567-3', '3584678901', 'San Martín 456', 'contacto@hospitalsanmartin.com', 1, 2),
(2, 'Hospital Regional del Sur', '30-45678901-6', '3584789012', 'Independencia 345', 'contacto@hrs.gov.ar', 2, 2),
(3, 'Farmacia Central', '30-65432109-7', '3514567890', 'Av. Colón 123', 'farmaciacentral@gmail.com', 2, 1),
(4, 'Farmacia del Pueblo', '30-78945612-9', '3543654321', 'Belgrano 789', 'info@farmaciadelpueblo.com', 3, 1),
(5, 'Farmacia Salud', '30-56789012-5', '3515678901', '9 de Julio 890', 'farmaciasalud@gmail.com', 4, 1),
(6, 'Laboratorio Genaro SRL', '25-98765999-1', 'Av Santa Fe 123', '0115012345', 'info@genaro.com.ar', 6, 4),
(7, 'Laboratorio GenPharma', '30-65498732-8', '3584456789', 'Parque Industrial Norte', 'contacto@genpharma.com', 1, 4),
(8, 'Clínica Río Cuarto', '30-67890123-4', '3572689012', 'Rivadavia 234', 'administracion@clinicariocuarto.com', 1, 3),
(9, 'Sanatorio Córdoba', '30-23456789-8', '3572801234', 'Italia 321', 'info@sanatoriocba.com', 2, 3),
(10, 'Clínica Vida Sana', '30-99887766-5', '3543754321', 'Urquiza 678', 'contacto@vidasana.com', 3, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalles_pedidos`
--

CREATE TABLE `detalles_pedidos` (
  `id_detalle` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) GENERATED ALWAYS AS (`cantidad` * `precio_unitario`) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalles_pedidos`
--

INSERT INTO `detalles_pedidos` (`id_detalle`, `id_pedido`, `id_producto`, `cantidad`, `precio_unitario`) VALUES
(37, 1, 1, 5, 2500.00),
(38, 1, 3, 10, 1200.00),
(39, 2, 2, 3, 18000.00),
(40, 3, 4, 2, 32000.00),
(41, 4, 1, 8, 2500.00),
(42, 5, 6, 10, 8999.99),
(43, 6, 7, 2, 11500.00),
(44, 7, 8, 6, 15000.00),
(45, 8, 3, 7, 18000.00),
(46, 9, 4, 5, 4500.00),
(47, 10, 1, 5, 1200.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados_pedido`
--

CREATE TABLE `estados_pedido` (
  `id_estado` int(11) NOT NULL,
  `nombre_estado` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estados_pedido`
--

INSERT INTO `estados_pedido` (`id_estado`, `nombre_estado`) VALUES
(1, 'Pendiente'),
(2, 'En proceso'),
(3, 'Completado'),
(4, 'Cancelado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id_pedido` int(11) NOT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `total` decimal(10,2) DEFAULT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_sucursal` int(11) NOT NULL,
  `id_estado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id_pedido`, `fecha`, `total`, `id_cliente`, `id_usuario`, `id_sucursal`, `id_estado`) VALUES
(1, '2025-11-10 10:30:00', 150000.00, 1, 2, 1, 1),
(2, '2025-05-05 00:00:00', 726696.00, 4, 3, 4, 2),
(3, '2025-11-10 12:45:00', 72000.00, 3, 1, 1, 3),
(4, '2025-11-11 09:20:00', 63500.75, 4, 4, 3, 1),
(5, '2025-11-11 15:10:00', 89999.99, 5, 6, 5, 4),
(6, '2025-11-12 08:50:00', 230000.00, 6, 7, 6, 3),
(7, '2025-11-12 10:00:00', 125000.00, 7, 9, 8, 2),
(8, '2025-11-12 14:30:00', 156000.00, 8, 8, 1, 1),
(9, '2025-11-12 16:00:00', 47500.00, 9, 5, 4, 3),
(10, '2025-11-12 17:45:00', 128000.00, 10, 10, 9, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `id_proveedor` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `nombre`, `descripcion`, `precio`, `id_proveedor`) VALUES
(1, 'Vitamina A 600 mg', 'Suplemento de vitamina A', 111.00, 1),
(2, 'Ibuprofeno', 'Anti-inflamatorio', 200.00, 1),
(3, 'Amoxicilina', 'Antibiótico', 350.00, 2),
(4, 'Jarabe Tos', 'Jarabe para la tos', 120.00, 3),
(6, 'Vitamina C 500mg', 'Suplemento de vitamina C', 250.00, 2),
(7, 'CremReti', 'Crema con Retinol y vitamina A', 300.00, 4),
(8, 'Paracetamol', 'Analgesico, antifebril', 300.00, 3),
(9, 'Antigripal Forte', 'Comprimidos para el alivio de síntomas gripales', 5200.00, 2),
(10, 'Alcohol en gel 500ml', 'Desinfectante de manos 70% alcohol', 1800.00, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id_proveedor` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `id_ciudad` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`id_proveedor`, `nombre`, `telefono`, `email`, `direccion`, `id_ciudad`) VALUES
(1, 'Laboratorio Roche', '0358-123456', 'contacto@roche.com', 'Calle Falsa 123', 1),
(2, 'Laboratorio Pfizer', '0358-654321', 'info@pfizer.com', 'Avenida Siempre Viva 742', 2),
(3, 'Laboratorio Bayer', '0341-987654', 'ventas@bayer.com', 'Calle Rosario 456', 3),
(4, 'Laboratorios Bago', '011-4711-7859', 'clientes@bago.com.ar', 'Av. Titanes 999', 3),
(6, 'Laboratorios Azul', '0352-4711-7859', 'clientes@azul.com.ar', 'Av. Tronador 3432, Marco Juarez', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `provincias`
--

CREATE TABLE `provincias` (
  `id_provincia` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `provincias`
--

INSERT INTO `provincias` (`id_provincia`, `nombre`) VALUES
(1, 'Córdoba'),
(2, 'Buenos Aires'),
(3, 'Santa Fe'),
(4, 'Mendoza');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_rol` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id_rol`, `nombre`) VALUES
(1, 'Administrador'),
(2, 'Empleado'),
(3, 'Gerente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `stock`
--

CREATE TABLE `stock` (
  `id_stock` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad_disponible` int(11) NOT NULL DEFAULT 0,
  `punto_reposicion` int(11) DEFAULT 0,
  `ultima_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `stock`
--

INSERT INTO `stock` (`id_stock`, `id_producto`, `cantidad_disponible`, `punto_reposicion`, `ultima_actualizacion`) VALUES
(1, 1, 409, 0, '2025-11-11 10:49:38'),
(2, 2, 50, 0, '2025-11-11 10:49:38'),
(3, 3, 75, 0, '2025-11-11 10:49:38'),
(4, 4, 200, 0, '2025-11-11 10:49:38'),
(5, 6, 40, 0, '2025-11-11 10:49:38');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sucursales`
--

CREATE TABLE `sucursales` (
  `id_sucursal` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `id_ciudad` int(11) DEFAULT NULL,
  `responsable` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sucursales`
--

INSERT INTO `sucursales` (`id_sucursal`, `nombre`, `direccion`, `telefono`, `email`, `id_ciudad`, `responsable`) VALUES
(1, 'Sucursal Central Río Cuarto', 'Av. San Martín 1240', '358-4567890', 'central.riocuarto@farmadist.com', 1, 'Mariana López'),
(2, 'Sucursal Córdoba Centro', 'Bv. Illia 550', '351-4123456', 'cordoba.centro@farmadist.com', 2, 'Sergio Fernández'),
(3, 'Sucursal Nueva Córdoba', 'Obispo Oro 230', '351-4341122', 'nuevacordoba@farmadist.com', 2, 'Natalia Herrera'),
(4, 'Sucursal Rosario Norte', 'Av. Alberdi 890', '341-4789321', 'rosario.norte@farmadist.com', 3, 'Juan Pablo Acuña'),
(5, 'Sucursal Santa Fe Capital', '25 de Mayo 4100', '342-4567891', 'santafe.capital@farmadist.com', 4, 'Romina Pérez'),
(6, 'Sucursal Mendoza Centro', 'Av. Las Heras 230', '261-4432100', 'mendoza.centro@farmadist.com', 5, 'Martín Godoy'),
(7, 'Sucursal Godoy Cruz', 'San Martín Sur 1420', '261-4789056', 'godoycruz@farmadist.com', 5, 'Silvina Torres'),
(8, 'Sucursal Buenos Aires Norte', 'Av. Cabildo 2300', '11-47891234', 'bsas.norte@farmadist.com', 6, 'Carlos Benítez'),
(9, 'Sucursal Buenos Aires Sur', 'Av. Mitre 3500', '11-47981222', 'bsas.sur@farmadist.com', 6, 'Carla Giménez'),
(10, 'Sucursal Rosario Sur', 'Ovidio Lagos 2750', '341-4239876', 'rosario.sur@farmadist.com', 3, 'Pablo Rojas');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tiposcliente`
--

CREATE TABLE `tiposcliente` (
  `id_tipo` int(11) NOT NULL,
  `nombre_tipo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tiposcliente`
--

INSERT INTO `tiposcliente` (`id_tipo`, `nombre_tipo`) VALUES
(1, 'Farmacia'),
(2, 'Hospital'),
(3, 'Clínica Privada'),
(4, 'Laboratorio');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `id_rol` int(11) NOT NULL,
  `id_sucursal` int(11) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `email`, `password`, `id_rol`, `id_sucursal`, `activo`, `fecha_creacion`) VALUES
(1, 'María', 'Gómez', 'maria.gomez@farmaciaazul.com', '$2b$10$ZzPzVg8vA6WbT1P9TzTPReA53zRzYcFMkT8iC2L9P0nCJdZ2jz8fe', 1, 1, 1, '2025-11-13 12:43:40'),
(2, 'Juan', 'Pérez', 'juan.perez@farmaciacentro.com', '$2b$10$ZzPzVg8vA6WbT1P9TzTPReA53zRzYcFMkT8iC2L9P0nCJdZ2jz8fe', 2, 2, 1, '2025-11-13 12:43:40'),
(3, 'Lucía', 'Fernández', 'lucia.fernandez@farmaciasanmartin.com', '$2b$10$ZzPzVg8vA6WbT1P9TzTPReA53zRzYcFMkT8iC2L9P0nCJdZ2jz8fe', 3, 3, 1, '2025-11-13 12:43:40'),
(4, 'Carlos', 'Rodríguez', 'carlos.rodriguez@farmaciariocuarto.com', '$2b$10$ZzPzVg8vA6WbT1P9TzTPReA53zRzYcFMkT8iC2L9P0nCJdZ2jz8fe', 2, 1, 1, '2025-11-13 12:43:40'),
(5, 'Sofía', 'Molina', 'sofia.molina@farmaciarosario.com', '$2b$10$ZzPzVg8vA6WbT1P9TzTPReA53zRzYcFMkT8iC2L9P0nCJdZ2jz8fe', 3, 4, 1, '2025-11-13 12:43:40'),
(6, 'Diego', 'Suárez', 'diego.suarez@farmaciamendoza.com', '$2b$10$wKQzSS6qvuM7k7FdQ6jFoOmx3645u8RvK1lqU0pTQ0rNOFJAP5VUi', 1, 5, 1, '2025-11-13 12:43:40'),
(7, 'Valentina', 'Torres', 'valentina.torres@farmaciabaires.com', '$2b$10$ZzPzVg8vA6WbT1P9TzTPReA53zRzYcFMkT8iC2L9P0nCJdZ2jz8fe', 2, 6, 1, '2025-11-13 12:43:40'),
(8, 'Mario', 'Marin', 'marioma@gmail.com', '$2b$10$6.U9C5lrsFIhpkhk1i4x/.hnIJlus5odhNrwS9VhyUqsP.noXAGlK', 2, 4, 1, '2022-02-08 00:00:00'),
(9, 'Camila', 'Ruiz', 'camila.ruiz@farmacianorte.com', '$2b$10$ZzPzVg8vA6WbT1P9TzTPReA53zRzYcFMkT8iC2L9P0nCJdZ2jz8fe', 1, 3, 1, '2025-11-13 12:43:40'),
(10, 'Fernando', 'Díaz', 'fernando.diaz@farmaciasur.com', '$2b$10$ZzPzVg8vA6WbT1P9TzTPReA53zRzYcFMkT8iC2L9P0nCJdZ2jz8fe', 2, 5, 1, '2025-11-13 12:43:40'),
(11, 'Elena', 'Benitez', 'elenabenitez@gmail.com', '$2b$10$0jmsaEQA9w2sXWfHIaOj8eFlv2YgKAhitmUldS0o/y3.tG5b.aOY2', 2, 2, 1, '2023-01-01 00:00:00'),
(14, 'Maria', 'Sosa', 'mar@gmail.com', '$2b$10$pqbTYfTN1Np8GTCB/ILNuuj.8wisgJl37NqXwwqmPcxvV6x.FOwLq', 2, 1, 1, '2023-09-08 00:00:00'),
(15, 'Carolina', 'Disanto', 'admin@gmail.com', '$2b$10$TGkxEAtJgAe85WijVTVnue.OvRTiP2TVBt1lwjlGuKKVp.AMlJmiK', 1, 1, 1, '2025-09-08 00:00:00'),
(16, 'Elena', 'Ramirez', 'gerente@gmail.com', '$2b$10$vXGCDaNWHNqFX9JlMPMNU.ZhsFygMqiGpBCf2pdp8BleFhQSXdvA2', 3, 2, 1, '2022-10-08 00:00:00'),
(17, 'Alberto', 'Gomez', 'albert@gmail.com', '$2b$10$gW1729RZe5Nl6karNU1kBOVtsHKfiMZR1Y40/JIbX3YiHtSdUXKE2', 3, 4, 1, '2025-10-08 00:00:00');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  ADD PRIMARY KEY (`id_ciudad`),
  ADD KEY `id_provincia` (`id_provincia`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`),
  ADD UNIQUE KEY `cuit` (`cuit`),
  ADD KEY `id_ciudad` (`id_ciudad`),
  ADD KEY `id_tipo` (`id_tipo`);

--
-- Indices de la tabla `detalles_pedidos`
--
ALTER TABLE `detalles_pedidos`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_pedido` (`id_pedido`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `estados_pedido`
--
ALTER TABLE `estados_pedido`
  ADD PRIMARY KEY (`id_estado`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_sucursal` (`id_sucursal`),
  ADD KEY `id_estado` (`id_estado`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `id_proveedor` (`id_proveedor`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id_proveedor`),
  ADD KEY `id_ciudad` (`id_ciudad`);

--
-- Indices de la tabla `provincias`
--
ALTER TABLE `provincias`
  ADD PRIMARY KEY (`id_provincia`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `stock`
--
ALTER TABLE `stock`
  ADD PRIMARY KEY (`id_stock`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `sucursales`
--
ALTER TABLE `sucursales`
  ADD PRIMARY KEY (`id_sucursal`);

--
-- Indices de la tabla `tiposcliente`
--
ALTER TABLE `tiposcliente`
  ADD PRIMARY KEY (`id_tipo`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `id_rol` (`id_rol`),
  ADD KEY `id_sucursal` (`id_sucursal`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `ciudades`
--
ALTER TABLE `ciudades`
  MODIFY `id_ciudad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `detalles_pedidos`
--
ALTER TABLE `detalles_pedidos`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT de la tabla `estados_pedido`
--
ALTER TABLE `estados_pedido`
  MODIFY `id_estado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id_proveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `provincias`
--
ALTER TABLE `provincias`
  MODIFY `id_provincia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `stock`
--
ALTER TABLE `stock`
  MODIFY `id_stock` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `sucursales`
--
ALTER TABLE `sucursales`
  MODIFY `id_sucursal` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `tiposcliente`
--
ALTER TABLE `tiposcliente`
  MODIFY `id_tipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ciudades`
--
ALTER TABLE `ciudades`
  ADD CONSTRAINT `ciudades_ibfk_1` FOREIGN KEY (`id_provincia`) REFERENCES `provincias` (`id_provincia`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`id_ciudad`) REFERENCES `ciudades` (`id_ciudad`),
  ADD CONSTRAINT `clientes_ibfk_2` FOREIGN KEY (`id_tipo`) REFERENCES `tiposcliente` (`id_tipo`);

--
-- Filtros para la tabla `detalles_pedidos`
--
ALTER TABLE `detalles_pedidos`
  ADD CONSTRAINT `detalles_pedidos_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`),
  ADD CONSTRAINT `detalles_pedidos_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  ADD CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `pedidos_ibfk_3` FOREIGN KEY (`id_sucursal`) REFERENCES `sucursales` (`id_sucursal`),
  ADD CONSTRAINT `pedidos_ibfk_4` FOREIGN KEY (`id_estado`) REFERENCES `estados_pedido` (`id_estado`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD CONSTRAINT `proveedores_ibfk_1` FOREIGN KEY (`id_ciudad`) REFERENCES `ciudades` (`id_ciudad`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `stock`
--
ALTER TABLE `stock`
  ADD CONSTRAINT `stock_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`),
  ADD CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`id_sucursal`) REFERENCES `sucursales` (`id_sucursal`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

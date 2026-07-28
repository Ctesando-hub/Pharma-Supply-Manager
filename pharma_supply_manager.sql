-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 24-07-2026 a las 21:52:29
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
  `id_provincia` int(11) NOT NULL,
  `ciudad_eliminada` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ciudades`
--

INSERT INTO `ciudades` (`id_ciudad`, `nombre`, `id_provincia`, `ciudad_eliminada`) VALUES
(1, 'Río Cuarto', 1, NULL),
(2, 'Córdoba', 1, NULL),
(3, 'Rosario', 3, NULL),
(4, 'Santa Fe', 3, NULL),
(5, 'Mendoza', 4, NULL),
(6, 'Buenos Aires', 2, NULL),
(7, 'Cosquin', 1, '2026-07-06 20:05:40'),
(8, 'Salsipuedes', 1, '2026-07-11 17:46:08');

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
  `id_tipo` int(11) DEFAULT NULL,
  `cliente_eliminado` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `nombre`, `cuit`, `telefono`, `direccion`, `email`, `id_ciudad`, `id_tipo`, `cliente_eliminado`) VALUES
(1, 'Hospital San Martín', '30-71234567-3', '3584678901', 'San Martín 456', 'contacto@hospitalsanmartin.com', 1, 2, NULL),
(2, 'Hospital Regional del Sur', '30-45678901-6', 'Sobremonte 345', '3584789012', 'regionalSur@hrs.gov.ar', 1, 2, NULL),
(3, 'Farmacia Central', '30-65432109-7', '3514567890', 'Av. Colón 123', 'farmaciacentral@gmail.com', 2, 1, NULL),
(4, 'Farmacia del Pueblo', '30-78945612-9', '3543654321', 'Belgrano 789', 'info@farmaciadelpueblo.com', 3, 1, NULL),
(5, 'Farmacia Salud', '30-56789012-5', '3515678901', '9 de Julio 890', 'farmaciasalud@gmail.com', 4, 1, NULL),
(6, 'Laboratorio Genaro SRL', '25-98765999-1', 'Av Santa Fe 123', '0115012345', 'info@genaro.com.ar', 6, 4, NULL),
(7, 'Laboratorio GenPharma', '30-65498732-8', '3584456789', 'Parque Industrial Norte', 'contacto@genpharma.com', 1, 4, NULL),
(8, 'Clínica Río Cuarto', '30-67890123-4', '3572689012', 'Rivadavia 234', 'administracion@clinicariocuarto.com', 1, 3, NULL),
(9, 'Sanatorio Córdoba', '30-23456789-8', '3572801234', 'Italia 321', 'info@sanatoriocba.com', 2, 3, NULL),
(10, 'Clínica Vida Sana', '30-99887766-5', '3543754321', 'Urquiza 678', 'contacto@vidasana.com', 3, 3, NULL),
(12, 'Hospital  Santa Ana', '30-99666558-8', '1133555402', 'Cochabamba 546', 'santaana@gmail.com', 5, 2, '2026-06-01 13:19:20'),
(13, 'Drogueria San Jorge SRL', '12-8956256-36', '112003005', 'Belgrano 78', 'sanjorged@contactos.com', 4, 5, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compras`
--

CREATE TABLE `compras` (
  `id_compra` int(11) NOT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `total` decimal(10,2) DEFAULT NULL,
  `id_proveedor` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_sucursal` int(11) DEFAULT NULL,
  `id_estado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `compras`
--

INSERT INTO `compras` (`id_compra`, `fecha`, `total`, `id_proveedor`, `id_usuario`, `id_sucursal`, `id_estado`) VALUES
(3, '2026-03-14 20:33:52', 10000.00, 4, 3, 3, 3),
(4, '2026-03-16 11:06:55', 10000.00, 4, 2, 3, 3),
(5, '2026-03-16 11:16:05', 10000.00, 4, 3, 3, 3),
(6, '2026-03-24 18:23:53', 10000.00, 2, 1, 3, 2),
(7, '2026-06-16 10:38:31', 3125000.00, 4, 27, 8, 3),
(8, '2026-06-16 10:47:59', 700000.00, 5, 27, 7, 3),
(9, '2026-06-16 20:01:21', 620000.00, 3, 27, 8, 3),
(10, '2026-06-16 20:07:02', 315000.00, 2, 27, 10, 1),
(11, '2026-06-17 12:43:09', 280000.00, 1, 29, 8, 3),
(12, '2026-06-17 19:02:54', 1470000.00, 2, 30, 6, 3);

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
(47, 10, 1, 5, 1200.00),
(48, 21, 1, 2, 111.00),
(49, 21, 2, 1, 200.00),
(50, 22, 1, 2, 111.00),
(51, 22, 2, 1, 200.00),
(52, 23, 1, 25, 111.00),
(53, 23, 2, 20, 200.00),
(56, 26, 3, 55, 121.00),
(57, 26, 6, 20, 99.00),
(58, 27, 1, 13, 121.00),
(59, 27, 2, 60, 999.00),
(60, 29, 4, 50, 120.00),
(61, 29, 7, 120, 300.00),
(62, 30, 4, 50, 120.00),
(63, 30, 7, 120, 300.00),
(64, 31, 4, 50, 10000.00),
(65, 31, 7, 120, 19028.00),
(66, 32, 4, 10, 10000.00),
(67, 32, 7, 10, 19028.00),
(68, 33, 6, 10, 141000.00),
(69, 34, 18, 90, 4020.00),
(70, 34, 34, 20, 20000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_compras`
--

CREATE TABLE `detalle_compras` (
  `id_detalle_compra` int(11) NOT NULL,
  `id_compra` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) GENERATED ALWAYS AS (`cantidad` * `precio_unitario`) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_compras`
--

INSERT INTO `detalle_compras` (`id_detalle_compra`, `id_compra`, `id_producto`, `cantidad`, `precio_unitario`) VALUES
(1, 3, 1, 500, 111.00),
(2, 3, 2, 110, 200.00),
(3, 4, 3, 420, 111.00),
(4, 4, 6, 200, 350.00),
(5, 5, 3, 333, 199.00),
(6, 5, 6, 155, 350.00),
(7, 6, 3, 100, 199.00),
(8, 6, 6, 50, 350.00),
(9, 7, 30, 80, 25000.00),
(10, 7, 23, 25, 45000.00),
(11, 8, 45, 20, 20000.00),
(12, 8, 49, 30, 10000.00),
(13, 9, 58, 26, 10000.00),
(14, 9, 13, 12, 30000.00),
(15, 10, 9, 35, 9000.00),
(16, 11, 37, 20, 8000.00),
(17, 11, 39, 30, 4000.00),
(18, 12, 2, 50, 9000.00),
(19, 12, 8, 120, 8500.00);

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
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
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
(1, '2025-11-10 10:30:00', 150000.00, 1, 2, 1, 4),
(2, '2025-05-05 00:00:00', 726696.00, 4, 3, 4, 3),
(3, '2025-11-10 12:45:00', 72000.00, 3, 1, 1, 3),
(4, '2025-11-11 09:20:00', 63500.75, 4, 4, 3, 4),
(5, '2025-11-11 15:10:00', 89999.99, 5, 6, 5, 4),
(6, '2025-11-12 08:50:00', 230000.00, 6, 7, 6, 3),
(7, '2025-11-12 10:00:00', 125000.00, 7, 9, 8, 2),
(8, '2025-11-12 14:30:00', 156000.00, 8, 8, 1, 1),
(9, '2025-11-12 16:00:00', 47500.00, 9, 5, 4, 3),
(10, '2025-11-12 17:45:00', 128000.00, 10, 10, 9, 1),
(21, '2026-03-10 16:05:10', 4500.00, 1, 15, 1, 4),
(22, '2026-03-11 12:36:53', 4500.00, 1, 15, 1, 1),
(23, '2026-03-11 12:37:37', 4500.00, 1, 15, 1, 1),
(26, '2026-03-30 13:08:02', 8613.00, 1, 15, 1, 4),
(27, '2026-03-31 11:38:39', 8613.00, 1, 15, 1, 4),
(29, '2026-04-03 19:14:39', 42000.00, 1, 15, 1, 1),
(30, '2026-04-07 12:06:23', 42000.00, 1, 15, 1, 4),
(31, '2026-07-02 10:36:33', 2783360.00, 1, 15, 1, 3),
(32, '2026-07-02 10:42:37', 290280.00, 1, 15, 1, 4),
(33, '2026-07-02 11:43:13', 1410000.00, 4, 27, 1, 1),
(34, '2026-07-02 11:50:28', 761800.00, 7, 27, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `id_proveedor` int(11) DEFAULT NULL,
  `imagen_url` varchar(500) DEFAULT NULL,
  `prospecto_url` varchar(500) DEFAULT NULL,
  `prod_eliminado` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `nombre`, `descripcion`, `precio`, `id_proveedor`, `imagen_url`, `prospecto_url`, `prod_eliminado`) VALUES
(1, 'Alplax', 'Ansiolítico. ALPLAX® 0,25-0,5-1 mg: Envases con 30 y 60 comprimidos.', 2100.00, 2, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776261230/G00007203-14-alplax-850x638_x16yok.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776263664/G00073003-10-alplax-web_page-0001_se4gqa.jpg', NULL),
(2, 'Reliveran ', 'Antiemético, antinauseoso, propulsivo.', 14000.00, 2, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776262681/7792183002324-reliveran_trorg7.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776263821/G00163404-02-Reliveran-web-1_page-0001_q0navl.jpg', NULL),
(3, 'Insomnium', 'Hipnótico no benzodiazepínico. Envases 30 comprimidos.', 21900.00, 2, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776262692/Insommium_iqm0tr.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776264119/G00077101-11-INSOMNIUM_page-0001_in8hqs.jpg', NULL),
(4, 'Gadoferol', 'Vitamina D3 100.000 UI.', 10000.00, 2, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776262691/Gadoferol-850x590_dyegl4.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776264450/G00168601-02-ProspectoWebGadoferol_page-0001_x0lzpf.jpg', NULL),
(6, 'Vanserin', 'Antipsicótico atípico. Envases conteniendo 30 cápsulas.', 141000.00, 2, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776262689/G00214800-00-Vanserin-850x638_txn8ja.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776264810/G00214701-02-vanserin-web_page-0001_qfaygg.jpg', NULL),
(7, 'Diocam', 'Clonazepam 0,50, 1 y 2 mg. Ansiolítico – Antiepiléptico. ', 19028.00, 2, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776262688/G00147302-04_Diocam-850x638_qaxzwa.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776265047/G00146807-04-DIOCAM_web_page-0001_ktbj7f.jpg', NULL),
(8, 'Squam Gel', 'Crema Dental Anticaries.', 8400.00, 2, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776262687/G00030003-07-Squam-Gel-850x638_yb1uxt.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776265288/G00082203-06-Squam-Gel_page-0001_zi83f6.jpg', NULL),
(9, 'Bucogel', 'Clorhexidina Digluconato 0,12%. Gel antiséptico para uso bucal.', 10000.00, 2, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776262685/G00010602-04-850x638_lkjwxy.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776265535/G00074302-04-bucogel-web_page-0001_ew9ail.jpg', NULL),
(10, 'April', 'Anticonceptivo estro-progestacional.\r\nEnvase con 21 comprimidos recubiertos.', 7300.00, 2, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776262683/april-1-850x638_yrskqu.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776265857/G00072203-01-april-web_page-0001_c2avaq.jpg', NULL),
(12, 'Pomalid', 'Agente inmunosupresor. Pomalidomida 4 mg. Cápsulas duras.', 17450.50, 2, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776262682/7792183002676_Pomalid-850x638_t33sjy.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776266371/G00178002-03-POMALID_web_page-0001_kwck6s.jpg', NULL),
(13, 'Alercas', 'Antialérgico.Antihistaminico no sedativo.', 9950.00, 3, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776261165/Alercas_D_robczh.jpg', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776266686/D2913-E-2587-01-Instruccion-Alercas-D_page-0001_o8ztpa.jpg', NULL),
(14, 'Perdural', 'Tratamiento de la hiperplasia prostática benigna.', 23750.00, 3, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776266785/Perdural_20_mv02jd.jpg', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776267214/PERDURAL_djcqtl.jpg', NULL),
(15, 'Pantocas', 'Reduce la producción de ácido estomacal.', 5700.75, 3, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776266783/Pantocas_40x30_dimcqh.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776267403/Pantocas_page-0001_serupn.jpg', NULL),
(16, 'Factor Dermico', 'Antibacteriano, antimicótico, antiinflamatorio de uso tópico.', 12460.99, 3, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776266780/Factor_Dermico_fs8pvd.jpg', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776267595/Instruccion-Factor-Dermico-Venta_page-0001_xco8tl.jpg', NULL),
(17, 'Ernex Duo', 'Antiinflamatorio y antiséptico de uso tópico.', 15500.00, 3, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776266777/Ernex_Duo_if2qnu.jpg', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776267774/D0299-E-0863-03-Instruccion-Ernex-Duo_page-0001_ylmwqd.jpg', NULL),
(18, 'Corticas L', 'Antialérgico, antiinflamatorio, antihistamínico.', 4020.00, 3, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776266774/Corticas_L_p4jl8x.jpg', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776268072/d1689-e-1557-01-instruccion-corticas-l_page-0001_cwtnle.jpg', NULL),
(19, 'Callexe XR', 'Antiepiléptico. Anticonvulsivante.', 89300.25, 3, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776266771/Callexe_XR_750_rzvye5.jpg', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776268301/Callexe-XR_compressed_page-0001_xmoz7e.jpg', NULL),
(20, 'Blokium 25', 'Analgésico y antiinflamatorio no esteroideo. Diclofenac Sódico.', 3500.90, 3, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776266769/Blokium_25_X_10_compr_vlxwvt.jpg', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776268530/D7625-E-7286-01-INST-BLOKIUM-25-VL-Completa-200x150-prospecto_compressed_page-0001_yxkiha.jpg', NULL),
(21, 'Algispray', 'Gas refrigerante, para la aplicación de frío sobre la piel, calma el dolor y controla la inflamación', 33750.00, 3, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776266766/Algispray_yq32on.jpg', NULL, NULL),
(22, 'Algicur Gel', 'Analgésico. Antiinflamatorio no esteroide.', 12000.50, 3, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776266763/Algicur_pomo_eccwzo.jpg', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776268923/ALGICUR-GEL_bqjhn7.jpg', NULL),
(23, 'Bagóvit Solar FPS 45', 'Bagóvit Solar FPS 45 Facial con color x 50 gr.', 22885.00, 4, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776269421/pomo-45-1_wfmipn.jpg', NULL, NULL),
(24, 'Artinovo', 'Suplemento dietario cuyos componentes ayudan a la regeneración natural del cartílago.', 20000.00, 4, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776269417/Pack-Artinovo-3_v0u3yc.png', NULL, NULL),
(25, 'Lucidex 10', 'Neuroprotector. Reactivador de las funciones psíquicas y motoras.', 47170.75, 4, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776269413/lucidex-10-comprimidos-recubiertos-laboratorios-bago_mnmljr.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776270189/Prospecto-Lucidex-10-CoR_page-0001_x5oaoq.jpg', NULL),
(26, 'Bagóvit A Classic', 'Crema Nutritiva x 400 gr. Repara, protege y revitaliza la piel reseca. Su fórmula es hipoalergénica.', 24500.99, 4, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776269409/classic-400-bagovit_qoymy2.jpg', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776270551/Bagovit-A-Classic-Prospecto_page-0001_1_ic2ta2.jpg', NULL),
(27, 'CHÍA OMEGA-3 BAGÓ', 'suplemento dietario de origen vegetal que ayuda a reducir los niveles de Colesterol y Triglicéridos.', 21400.00, 4, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776269405/chia-712x441_hx9bie.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776270931/prospecto-CHIA_web_page-0001_rb0yiu.jpg', NULL),
(28, 'Cefalomicina 1000', 'Antibacteriano. Polvo liofilizado para inyectable.', 1677.00, 4, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776269401/cefalomicina-1000-inyectable-laboratorios-bago_gdbrqa.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776271672/CEFALOMICINA-1000_guwehr.jpg', NULL),
(29, 'Bagó B1 B6 B12 5000', 'Aporte de vitaminas B1, B6 y B12. Envases por 30 comprimidos recubiertos.', 27060.25, 4, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776269396/bago-b1-b6-b12-5000-comprimidos-recubiertos-laboratorios-bago_it43a0.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776271931/Prospecto-Bago-B1-B6-B12-5.000_yqkt8f.jpg', NULL),
(30, 'Bagó+ Calma', 'Suplemento dietario a base de Tilo y Melisa, Vitamina B6, Teanina, Vitamina D.', 13500.90, 4, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776269392/bago_calma_al3lls.png', NULL, NULL),
(31, 'Anaflex Paracetamol', 'Alivio rápido para dolor corporal y fiebre. Ideal para malestares cotidianos.', 1000.00, 4, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776269388/Anaflex-Paracetamol_d9g0xt.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776273112/Prospecto-Anaflex-Paracetamol-500_dckqe9.jpg', NULL),
(32, 'Actual antiácido', 'ACTUAL Masticable antiácido de venta libre. Brinda alivio inmediato y durante 12 horas', 6093.50, 4, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776269385/actual-712x441_wfl00c.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776273439/Prospecto-Dispo-3262-24-1_page-0001_mg0etj.jpg', NULL),
(33, 'Taural F', 'Antiulceroso. Famotidina 40 mg Comprimidos x 30', 18500.00, 1, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776274587/Taural_pl3dvv.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776273439/Prospecto-Dispo-3262-24-1_page-0001_mg0etj.jpg', NULL),
(34, 'Optamox Dúo', 'Antibiótico. Amoxicilina / Ácido clavulánico', 20000.00, 1, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776274583/Optamox_avbwe0.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776275088/P_Optamox-Duo_sadsug.jpg', NULL),
(35, 'Micolis', 'Antimicótico 1 gr Crema x 30 gr.', 6793.75, 1, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776274578/Micolis_rkmcef.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776275272/Micolis_page-0001_jdjtet.jpg', NULL),
(36, 'Lexobron', 'Antibiótico. Levofloxacina 500 mg Comprimidos recubiertos x 7', 18099.99, 1, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776274574/Lexobron_ndlopk.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776275478/Lexobron_page-0001_r5fobd.jpg', NULL),
(37, 'Febratic', 'Ibuprofeno. Antipirético. Suspensión x 100 ml', 5045.00, 1, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776274570/Febratic_vuzdji.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776275705/Febratic_rszy7s.jpg', NULL),
(38, 'Dorixina', 'Analgésico antiinflamatorio. Clonixinato de lisina 125 mg Comprimidos recubiertos x 20.', 5310.00, 1, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776274565/Dorixina_prsxqv.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776275921/Dorixina_page-0001_fql1cw.jpg', NULL),
(39, 'Ciriax Otic', 'Antiinflamatorio de uso tópico. Ciprofloxacina / Hidrocortisona 0,2 gr / 1 gr Gotas x 5 ml.', 5360.25, 1, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776274560/Ciriax_u48mae.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776276191/Ciriax_page-0001_pemiol.jpg', NULL),
(40, 'Ceporexin 500', 'Antibiótico. Cefalexina (Monohidrato)500 mg Comprimidos Recubiertos x 16', 12950.90, 1, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776274556/Ceporexin_mgor85.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776290072/Ceporexin_gjagze.jpg', NULL),
(41, 'Athos Jarabe', 'Mucolítico expectorante espasmolítico. Extracto seco hojas de hiedra desecadas.', 12020.00, 1, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776274551/Athos_tlpxc3.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776290367/Athos_zxdj1p.jpg', NULL),
(42, 'Amoxidal 500', 'Antibiótico. Amoxicilina 500 mg Suspensión x 90 ml', 6550.20, 1, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776274548/Amoxidal_s0tv38.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776291985/Amoxidal_ajtzq3.jpg', NULL),
(43, 'Geniol Paracetamol', 'Analgésicos + Antifebril. Estuches conteniendo 2 blisters de 8 comprimidos c/u y 8 blisters de 8 comprimidos c/u. ', 2285.00, 5, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776292060/GENIOL_500mg_lsjhq2.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776293551/Prospecto_Geniol_pj12yv.jpg', NULL),
(44, 'Ripagcor', 'Agonista oral del receptor de trombopoyetina; incrementa rápidamente el recuento plaquetario.', 3200.00, 5, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776292065/Ripagcor_q21nnx.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776294363/Prospecto-RIPAGCOR_vonpd5.jpg', NULL),
(45, 'PH Lagrimas', 'Lubricantes Oculares. Dextran 70 100 mg + Hidroxipropilmetilcelulosa 300mg', 18050.75, 5, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776292064/PH_LAGRIMAS_ous9q2.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776294598/PH-LAGRIMAS_konmoh.jpg', NULL),
(46, 'Pervinox Jabón Líquido', 'Antiséptico para manos del personal quirúrgico. Desinfección de heridas y quemaduras.', 16099.99, 5, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776292063/Pervinox-Jabon-Liq_tozwsq.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776294818/Pervinox_Heridas_Jabon_Liquido_gybrqc.jpg', NULL),
(47, 'Nopucid® Iver', 'Loción pediculicida que contiene Ivermectina y se utiliza para el tratamiento tópico, externo de los piojos de la cabeza en niños mayores de 5 años.', 12045.00, 5, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776292062/nopucid-iver_lpsytb.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776296448/Nopucid-Iver_dbe21u.jpg', NULL),
(48, 'Lactorel', 'Chaperona farmacológica, indicada como tratamiento oral de pacientes con diagnóstico confirmado de Enfermedad de Fabry.', 28310.00, 5, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776292062/Lactorel_lp4hxo.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776296674/Lactorel-Prospecto_lmo2g0.jpg', NULL),
(49, 'Hepatalgina Efervecente', 'Digestivo + Hepatoprotector. Extracto de Boldo + Extracto de Carqueja + Extracto de Alcachofa.', 82060.25, 5, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776292061/Hepa-Efervescente_tjdcvb.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776296931/Hepatalgina-Efervescente-Prospecto_xiduxq.jpg', NULL),
(50, 'Fosfolea', 'Antibiótico urinario.1 sobre de polvo para solución oral.', 25075.90, 5, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776292060/Fosfolea-3-mg-x-1-sobre_leeawi.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776346980/Prosp-Fosfolea_tqyb9f.jpg', NULL),
(51, 'BioGrip Té Descongestivo', 'Analgésicos + Descongestivos + Antifebril + Antipiretico. Fenilefrina Clorhidrato + Paracetamol + Vitamina C', 6220.00, 5, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776292059/BioGrip-T_zrq0wt.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776347290/Prospecto-Biogrip_j8kidh.jpg', NULL),
(52, 'Aziatop Advance 20mg', 'Antiácidos. Omeprazol. Disminuye la producción de ácido estomacal.', 3520.50, 5, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776292058/Aziatop-Advance-20mg_svikx1.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1776347766/Aziatop_lb70n4.jpg', NULL),
(53, 'Adermicina Jabón Limpieza Facial', 'Con Carbon activado', 4500.00, 9, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1780856150/productos/uk3gx5h9mhhmg7gh5abp.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1780856151/prospectos/yoqxzdd1dcbkxpx4dbhi.png', NULL),
(54, 'Depocort Crono', 'DEPOCORT CRONO Inyectable 2 ml x 1 Frasco', 4000.00, 1, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1780853678/productos/ab9eudex71kb2olepof1.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1780853679/prospectos/jvkioqmegur56gbblmwf.jpg', NULL),
(55, 'Adermicina Jabón Limpieza Facial', '2 jabones en barra de 65g c/u. Con Carbon activado.', 4500.00, 5, NULL, NULL, '2026-06-07 17:31:38'),
(56, 'Adermicina Jabón Limpieza Facial', '2 jabones en barra de 65g c/u. Con Carbon activado.', 4500.00, 5, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1780779500/productos/kyobekqbuzf6bfznqdpb.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1780779501/prospectos/js4xkdtp0oftlx5ydvhg.jpg', NULL),
(57, 'Permicaps ', ' Envase conteniendo 30 Cápsulas Blandas, ovaladas, color celeste oscuro.', 47000.00, 4, 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1780855595/productos/muwjpu6eyqta5i3wyjlh.png', 'https://res.cloudinary.com/dr1xjwbom/image/upload/v1780855596/prospectos/tf8bq5qhow5gm882sxzw.jpg', NULL),
(58, 'Fedratinib 100 mg', 'Cápsula dura. Venta bajo receta archivada', 2.00, 3, NULL, NULL, NULL);

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
  `id_ciudad` int(11) DEFAULT NULL,
  `proveedor_eliminado` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`id_proveedor`, `nombre`, `telefono`, `email`, `direccion`, `id_ciudad`, `proveedor_eliminado`) VALUES
(1, 'Laboratorios Roemmers', '0358-123456', 'contacto@roemmers.com', 'Calle Falsa 123', 6, NULL),
(2, 'Laboratorios Gador', '1169522003', 'gadorlab@gmail.com', 'Av Rio de los Sauces 444', 1, NULL),
(3, 'Laboratorio Casasco', '0341-987654', 'ventas@casasco.com', 'Calle Rosario 456', 3, NULL),
(4, 'Laboratorios Bagó', '011-4711-7859', 'clientes@bago.com.ar', 'Av. Titanes 999', 6, NULL),
(5, 'Laboratorios Elea', '011-4711-7859', 'clientes@azul.com.ar', 'Av. Tronador 3432', 6, NULL),
(7, 'Laboratorios Leivas', '1169852699', 'leivaslab@contacto.com', 'Sobremonte Norte 347', 2, '2026-06-02 12:30:32'),
(9, 'Laboratorio Santa Lucia SRL', '1122569852', 'lucialab@contacto.com', 'Corrientes 768', 6, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `provincias`
--

CREATE TABLE `provincias` (
  `id_provincia` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `provincia_eliminada` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `provincias`
--

INSERT INTO `provincias` (`id_provincia`, `nombre`, `provincia_eliminada`) VALUES
(1, 'Córdoba', NULL),
(2, 'Buenos Aires', NULL),
(3, 'Santa Fe', NULL),
(4, 'Mendoza', NULL),
(5, 'Entre Ríos', NULL),
(6, 'San Luis', NULL),
(7, 'Tierra del Fuego', '2026-07-08 12:16:03'),
(8, 'Santa Cruz', '2026-07-11 16:19:21');

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
  `ultima_actualizacion` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `cantidad_reservada` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `stock`
--

INSERT INTO `stock` (`id_stock`, `id_producto`, `cantidad_disponible`, `punto_reposicion`, `ultima_actualizacion`, `cantidad_reservada`) VALUES
(1, 1, 926, 50, '2026-07-04 18:41:21', 32),
(2, 2, 213, 120, '2026-07-03 16:06:47', 17),
(3, 3, 305, 100, '2026-07-04 18:41:21', 10),
(4, 4, 100, 0, '2026-07-02 12:36:58', 50),
(5, 6, 110, 0, '2026-07-02 11:43:13', 10),
(7, 7, 320, 200, '2026-07-02 12:37:20', 120),
(8, 58, 26, 0, '2026-06-16 20:04:09', 0),
(9, 8, 240, 50, '2026-07-02 12:29:07', 8),
(10, 9, 80, 40, '2024-02-10 16:21:04', 0),
(11, 10, 250, 100, '2025-05-12 16:21:04', 0),
(12, 12, 30, 50, '2025-10-12 16:21:04', 0),
(13, 13, 12, 50, '2026-06-16 20:04:09', 0),
(15, 14, 120, 25, '2026-07-01 13:22:42', 0),
(16, 15, 400, 100, '2026-02-12 16:21:04', 0),
(17, 16, 60, 50, '2025-06-03 16:21:04', 0),
(18, 17, 25, 50, '2026-06-12 16:26:02', 0),
(147, 18, 90, 80, '2026-07-02 11:50:28', 90),
(148, 19, 300, 100, '2026-06-12 16:21:04', 0),
(149, 20, 50, 50, '2026-06-12 16:21:04', 0),
(150, 21, 10, 40, '2026-06-12 16:21:04', 0),
(151, 22, 360, 100, '2026-07-19 18:21:11', 0),
(152, 33, 500, 150, '2026-06-12 16:21:04', 0),
(153, 34, 50, 50, '2026-07-02 11:50:28', 20),
(154, 35, 40, 50, '2026-06-12 16:21:04', 0),
(155, 36, 90, 40, '2026-07-19 18:20:29', 0),
(156, 37, 35, 50, '2026-06-17 12:49:51', 0),
(157, 38, 90, 60, '2026-06-12 16:21:04', 0),
(158, 39, 250, 100, '2026-06-17 12:49:51', 0),
(159, 40, 55, 50, '2026-06-12 16:21:04', 0),
(160, 41, 0, 70, '2026-06-12 16:21:04', 0),
(161, 42, 170, 100, '2026-06-12 16:21:04', 0),
(162, 54, 320, 120, '2026-06-12 16:21:04', 0),
(163, 23, 25, 20, '2026-06-16 16:10:19', 0),
(164, 24, 450, 100, '2026-07-19 18:21:36', 0),
(165, 25, 520, 150, '2026-07-19 18:21:53', 0),
(166, 26, 200, 90, '2026-07-19 18:22:09', 0),
(167, 27, 120, 100, '2026-07-19 18:22:29', 0),
(168, 28, 50, 100, '2026-07-19 18:22:45', 0),
(169, 29, 360, 90, '2026-07-19 18:27:35', 0),
(170, 30, 80, 40, '2026-06-16 16:08:51', 0),
(171, 31, 73, 90, '2026-07-19 18:25:10', 0),
(172, 32, 210, 111, '2026-07-19 18:25:27', 0),
(173, 57, 365, 255, '2026-07-19 18:26:07', 0),
(174, 43, 410, 170, '2026-07-19 18:26:36', 0),
(175, 44, 360, 120, '2026-07-19 18:27:21', 0),
(176, 45, 20, 0, '2026-06-16 16:11:23', 0),
(177, 46, 155, 90, '2026-07-19 18:27:01', 0),
(178, 47, 333, 88, '2026-07-19 18:27:58', 0),
(179, 48, 320, 110, '2026-07-19 18:28:13', 0),
(180, 49, 30, 0, '2026-06-16 16:11:23', 0),
(181, 50, 200, 100, '2026-07-19 18:28:35', 0),
(182, 51, 120, 115, '2026-07-19 18:28:54', 0),
(183, 52, 152, 180, '2026-07-19 18:29:15', 0),
(184, 55, 369, 210, '2026-07-19 18:29:34', 0),
(185, 56, 69, 100, '2026-07-19 18:29:49', 0),
(186, 53, 322, 125, '2026-07-19 18:30:08', 0);

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
  `nombre` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tiposcliente`
--

INSERT INTO `tiposcliente` (`id_tipo`, `nombre`) VALUES
(1, 'Farmacia'),
(2, 'Hospital'),
(3, 'Clínica Privada'),
(4, 'Laboratorio'),
(5, 'Droguería');

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
  `fecha_creacion` datetime DEFAULT current_timestamp(),
  `foto_url` varchar(255) DEFAULT NULL,
  `eliminado` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `email`, `password`, `id_rol`, `id_sucursal`, `activo`, `fecha_creacion`, `foto_url`, `eliminado`) VALUES
(1, 'Ezequiel', 'Marino', 'marino@gmail.com', '', 2, 4, 1, '2025-11-13 12:43:40', NULL, NULL),
(2, 'Juan', 'Elizondo', 'juan@gmail.com', '$2b$10$03.09H8otvW90LHna2oHeufOuSkvld.8gb3TBuwk1yMPvkKEYnrMy', 1, 2, 0, '2025-11-13 12:43:40', NULL, NULL),
(3, 'Lucía', 'Fernández', 'lucia.fernandez@farmaciasanmartin.com', '$2b$10$ZzPzVg8vA6WbT1P9TzTPReA53zRzYcFMkT8iC2L9P0nCJdZ2jz8fe', 2, 6, 1, '2025-11-13 12:43:40', NULL, NULL),
(4, 'Carlos', 'Rodríguez', 'carlos.rodriguez@farmaciariocuarto.com', '$2b$10$ZzPzVg8vA6WbT1P9TzTPReA53zRzYcFMkT8iC2L9P0nCJdZ2jz8fe', 3, 8, 0, '2025-11-13 12:43:40', NULL, NULL),
(5, 'Sofía', 'Molina', 'sofia.molina@farmaciarosario.com', '$2b$10$ZzPzVg8vA6WbT1P9TzTPReA53zRzYcFMkT8iC2L9P0nCJdZ2jz8fe', 3, 4, 1, '2025-11-13 12:43:40', NULL, '2026-05-27 18:53:55'),
(6, 'Norma', 'Suárez', 'norma.suarez@farmaciamendoza.com', '$2b$10$wKQzSS6qvuM7k7FdQ6jFoOmx3645u8RvK1lqU0pTQ0rNOFJAP5VUi', 2, 4, 1, '2025-11-13 12:43:40', NULL, NULL),
(7, 'Valentina', 'Torres', 'valentina.torres@farmaciabaires.com', '$2b$10$ZzPzVg8vA6WbT1P9TzTPReA53zRzYcFMkT8iC2L9P0nCJdZ2jz8fe', 2, 6, 1, '2025-11-13 12:43:40', NULL, '2026-05-23 17:09:20'),
(8, 'Mariana', 'Mercado', 'mariomar@gmail.com', '$2b$10$6.U9C5lrsFIhpkhk1i4x/.hnIJlus5odhNrwS9VhyUqsP.noXAGlK', 3, 3, 0, '2022-02-08 00:00:00', NULL, NULL),
(9, 'Camila', 'Ruiz', 'camila.ruiz@farmacianorte.com', '$2b$10$ZzPzVg8vA6WbT1P9TzTPReA53zRzYcFMkT8iC2L9P0nCJdZ2jz8fe', 1, 3, 1, '2025-11-13 12:43:40', NULL, NULL),
(10, 'Fernanda', 'Díaz', 'fernando.diaz@farmaciasur.com', '$2b$10$ZzPzVg8vA6WbT1P9TzTPReA53zRzYcFMkT8iC2L9P0nCJdZ2jz8fe', 2, 7, 0, '2025-11-13 12:43:40', NULL, NULL),
(11, 'Elena', 'Benitez', 'elenabenitez@gmail.com', '$2b$10$0jmsaEQA9w2sXWfHIaOj8eFlv2YgKAhitmUldS0o/y3.tG5b.aOY2', 2, 2, 1, '2023-01-01 00:00:00', NULL, NULL),
(15, 'Carolina', 'Disanto', 'admin@gmail.com', '$2b$10$TGkxEAtJgAe85WijVTVnue.OvRTiP2TVBt1lwjlGuKKVp.AMlJmiK', 1, 1, 1, '2025-09-08 00:00:00', NULL, '2026-05-23 19:53:39'),
(16, 'Elena', 'Ramirez', 'gerente@gmail.com', '$2b$10$vXGCDaNWHNqFX9JlMPMNU.ZhsFygMqiGpBCf2pdp8BleFhQSXdvA2', 3, 2, 1, '2022-10-08 00:00:00', NULL, NULL),
(17, 'Alberto', 'Gomez', 'albert@gmail.com', '$2b$10$gW1729RZe5Nl6karNU1kBOVtsHKfiMZR1Y40/JIbX3YiHtSdUXKE2', 3, 4, 1, '2025-10-08 00:00:00', NULL, NULL),
(18, 'Valentino', 'Escudero', 'valentin@gmail.com.ar', '$2b$10$bFGJ//9fDio6E2.Z.renvuqvyh1JCGpDRrehBkj3wHpMerYr26NWm', 3, 7, 1, '2026-05-19 12:46:14', NULL, '2026-05-23 17:09:11'),
(19, 'Carlos', 'Rosales', 'carlosrosa@gmail.com', '$2b$10$NpfV4FgjT9cK9JMDqZVVL.hPJNxffYkf5Sp40BXRu0AlwRzOhcuDi', 1, 1, 1, '2026-05-20 10:52:35', NULL, '2026-05-23 17:06:07'),
(21, 'Sergio', 'Mercado', 'sergmer@gmail.com', '$2b$10$7CxYVXVSO2pzJ21HyL53GO2utVZhT/RYA6DKtkvFzzd7IXPipSuBC', 1, 9, 1, '2026-05-21 13:07:48', NULL, '2026-05-23 17:17:20'),
(22, 'Micaela', 'Debia', 'micadeb@gmail.com', '$2b$10$o9HESIGTN/RoD9ETqKwPCucsBLs/c.ysaha5GLvQid6IsXNHbO80y', 3, 8, 1, '2026-05-22 15:27:05', NULL, '2026-05-22 20:14:17'),
(23, 'Lorena', 'Sosa', 'loresosa@gmail.com', '$2b$10$PbBE17MZX2SVb5cdJkT6d.DLWFG0CUy2KaBGGc7eLETj9RBS7qM/m', 3, 5, 1, '2026-05-23 17:15:56', NULL, NULL),
(24, 'Ana', 'Avila', 'anita@gmail.com', '$2b$10$hTKXC4Ztprx8OdLrZnBO4..tcXCH4fCfNCRgZFCgElagpWL2o8fV.', 1, 1, 1, '2026-05-23 20:09:58', NULL, NULL),
(25, 'Delfina', 'Suarez', 'delfina@gmail.com', '$2b$10$b0aSHBqQYZXSfTWJxv79CO2a9CZvYwQjgWr5u.c6YrWig3jnrXnAO', 1, 10, 1, '2026-06-01 13:04:20', NULL, NULL),
(26, 'Hugo', 'Rosas', 'hugo_rosas@gmail.com', '$2b$10$ILCAqUvHm4KCkTC5/gmjreC0ATGlqIJwnbE5NaiG/B805CUJ5hEo.', 2, 9, 1, '2026-06-04 14:59:39', NULL, NULL),
(27, 'Carolina', 'Tesando', 'caro@gmail.com', '$2b$10$vafUBVL6SlspG/WVvsg0W.utaCgOQUZxKrMVQGc/j54spbu1PMCRi', 1, 1, 1, '2026-06-11 10:51:31', NULL, NULL),
(29, 'Julia', 'Dazo', 'juliad@gmail.com', '$2b$10$eoTlPiq7myMj1nXqB5dOCer57Zcxn3jAksrZ0P3xW1aHkj5r8NLS2', 1, 6, 1, '2026-06-17 12:32:25', NULL, '2026-06-17 12:53:47'),
(30, 'Jorge', 'Mercado', 'jorge@gmail.com', '$2b$10$v6hYuyt1mxQYFZGkZRi8Guj/JUorVPnePKgCofGi9UiGNQxlAzBtO', 1, 3, 1, '2026-06-17 18:54:39', NULL, '2026-06-17 19:06:53'),
(31, 'Mario', 'Pacheco', 'mariopacheco@gmail.com', '$2b$10$QNOBiTgtBMAjQxw1POK0au4DjX5xFIxLwz90CsBeyFZtUd5.8zi.2', 3, 8, 1, '2026-07-13 17:22:50', NULL, NULL),
(32, 'Lucas', 'Blanc', 'lucas@gmail.com', '$2b$10$nvwa619Tr4hBCcKGk.HiTuKavONnNzKuhlqCMUbvuAd93Yia7ujcu', 2, 4, 1, '2026-07-14 12:12:37', NULL, NULL);

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
-- Indices de la tabla `compras`
--
ALTER TABLE `compras`
  ADD PRIMARY KEY (`id_compra`),
  ADD KEY `id_proveedor` (`id_proveedor`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_sucursal` (`id_sucursal`),
  ADD KEY `id_estado` (`id_estado`);

--
-- Indices de la tabla `detalles_pedidos`
--
ALTER TABLE `detalles_pedidos`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `idx_detalle_pedido` (`id_pedido`),
  ADD KEY `idx_detalle_producto` (`id_producto`);

--
-- Indices de la tabla `detalle_compras`
--
ALTER TABLE `detalle_compras`
  ADD PRIMARY KEY (`id_detalle_compra`),
  ADD KEY `id_compra` (`id_compra`),
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
  ADD UNIQUE KEY `id_producto` (`id_producto`);

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
  MODIFY `id_ciudad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `compras`
--
ALTER TABLE `compras`
  MODIFY `id_compra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `detalles_pedidos`
--
ALTER TABLE `detalles_pedidos`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT de la tabla `detalle_compras`
--
ALTER TABLE `detalle_compras`
  MODIFY `id_detalle_compra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `estados_pedido`
--
ALTER TABLE `estados_pedido`
  MODIFY `id_estado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id_proveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `provincias`
--
ALTER TABLE `provincias`
  MODIFY `id_provincia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `stock`
--
ALTER TABLE `stock`
  MODIFY `id_stock` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=187;

--
-- AUTO_INCREMENT de la tabla `sucursales`
--
ALTER TABLE `sucursales`
  MODIFY `id_sucursal` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `tiposcliente`
--
ALTER TABLE `tiposcliente`
  MODIFY `id_tipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

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
-- Filtros para la tabla `compras`
--
ALTER TABLE `compras`
  ADD CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`),
  ADD CONSTRAINT `compras_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `compras_ibfk_3` FOREIGN KEY (`id_sucursal`) REFERENCES `sucursales` (`id_sucursal`),
  ADD CONSTRAINT `compras_ibfk_4` FOREIGN KEY (`id_estado`) REFERENCES `estados_pedido` (`id_estado`);

--
-- Filtros para la tabla `detalles_pedidos`
--
ALTER TABLE `detalles_pedidos`
  ADD CONSTRAINT `detalles_pedidos_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`),
  ADD CONSTRAINT `detalles_pedidos_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  ADD CONSTRAINT `fk_detalle_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_detalle_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `detalle_compras`
--
ALTER TABLE `detalle_compras`
  ADD CONSTRAINT `detalle_compras_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compras` (`id_compra`),
  ADD CONSTRAINT `detalle_compras_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

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

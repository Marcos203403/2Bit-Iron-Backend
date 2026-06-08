-- =========================================================================
-- 1. CONTINGENCIA Y CREACIÓN DE LA BASE DE DATOS
-- =========================================================================
DROP DATABASE IF EXISTS bitiron_db;
CREATE DATABASE bitiron_db;
USE bitiron_db;

-- =========================================================================
-- 2. CREACIÓN DE TABLAS (Estructura base)
-- =========================================================================

CREATE TABLE CATEGORIA (
    IdCategoria  INT AUTO_INCREMENT PRIMARY KEY,
    Nombre       VARCHAR(100) NOT NULL,
    Descripcion  TEXT,
    Imagen_Url   VARCHAR(255)
);

CREATE TABLE PRODUCTO (
    IdProducto          INT AUTO_INCREMENT PRIMARY KEY,
    Nombre              VARCHAR(255) NOT NULL,
    Descripcion         TEXT,
    Precio              DECIMAL(10,2) NOT NULL,
    Stock               INT NOT NULL DEFAULT 0,
    Imagen_Url          VARCHAR(255),
    Genero              ENUM('hombre', 'mujer', 'unisex') NOT NULL DEFAULT 'unisex',
    Marca               VARCHAR(100),
    ObjetivoRecomendado VARCHAR(50), 
    Activo              BOOLEAN NOT NULL DEFAULT TRUE,
    IdCategoria         INT NOT NULL
);

CREATE TABLE CLIENTE (
    IdCliente       INT AUTO_INCREMENT PRIMARY KEY,
    NombreCompleto  VARCHAR(255) NOT NULL,
    Email           VARCHAR(255) NOT NULL UNIQUE,
    Password_Hash   VARCHAR(255) NOT NULL,
    Rol             ENUM('admin', 'cliente') NOT NULL DEFAULT 'cliente',
    ObjetivoFitness VARCHAR(100),
    FechaRegistro   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ASESORIA (
    IdAsesoria    INT AUTO_INCREMENT PRIMARY KEY,
    TipoPlan      VARCHAR(100) NOT NULL,
    PrecioMensual DECIMAL(10,2) NOT NULL,
    FechaInicio   DATE NOT NULL DEFAULT (CURRENT_DATE),
    FechaFin      DATE,
    PagadoAlDia   BOOLEAN NOT NULL DEFAULT FALSE,
    EstadoActivo  BOOLEAN DEFAULT TRUE,
    IdCliente     INT NOT NULL,
    RutinaGenerada TEXT,
    DietaGenerada TEXT
);

CREATE TABLE PEDIDO (
    IdPedido    INT AUTO_INCREMENT PRIMARY KEY,
    FechaPedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TotalPagar  DECIMAL(10,2) NOT NULL DEFAULT 0,
    Estado      ENUM('Pendiente', 'Pagado', 'Enviado', 'Entregado', 'Cancelado') NOT NULL DEFAULT 'Pendiente',
    IdCliente   INT NOT NULL
);

CREATE TABLE DETALLE_PEDIDO (
    IdDetalle      INT AUTO_INCREMENT PRIMARY KEY,
    IdPedido       INT NOT NULL,
    IdProducto     INT NOT NULL,
    Cantidad       INT NOT NULL,
    PrecioUnitario DECIMAL(10,2) NOT NULL
);

CREATE TABLE CARRITO (
    IdCarrito     INT AUTO_INCREMENT PRIMARY KEY,
    IdCliente     INT NOT NULL,
    IdProducto    INT NOT NULL,
    Cantidad      INT NOT NULL DEFAULT 1,
    FechaAgregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE LOG_SISTEMA (
    IdLog       INT AUTO_INCREMENT PRIMARY KEY,
    Fecha       DATETIME(3) DEFAULT CURRENT_TIMESTAMP(3),
    Proceso     VARCHAR(100) NOT NULL,
    Descripcion TEXT NOT NULL
);

-- =========================================================================
-- 3. RESTRICCIONES (Claves Foráneas y validaciones lógicas)
-- =========================================================================

-- Relaciones (Foreign Keys)
ALTER TABLE PRODUCTO ADD CONSTRAINT FK_Producto_Categoria
    FOREIGN KEY (IdCategoria) REFERENCES CATEGORIA(IdCategoria) ON DELETE RESTRICT;

ALTER TABLE ASESORIA ADD CONSTRAINT FK_Asesoria_Cliente
    FOREIGN KEY (IdCliente) REFERENCES CLIENTE(IdCliente) ON DELETE CASCADE;

ALTER TABLE PEDIDO ADD CONSTRAINT FK_Pedido_Cliente
    FOREIGN KEY (IdCliente) REFERENCES CLIENTE(IdCliente) ON DELETE CASCADE;

ALTER TABLE DETALLE_PEDIDO ADD CONSTRAINT FK_Detalle_Pedido
    FOREIGN KEY (IdPedido) REFERENCES PEDIDO(IdPedido) ON DELETE CASCADE;

ALTER TABLE DETALLE_PEDIDO ADD CONSTRAINT FK_Detalle_Producto
    FOREIGN KEY (IdProducto) REFERENCES PRODUCTO(IdProducto) ON DELETE RESTRICT;

ALTER TABLE CARRITO ADD CONSTRAINT FK_Carrito_Cliente
    FOREIGN KEY (IdCliente) REFERENCES CLIENTE(IdCliente) ON DELETE CASCADE;

ALTER TABLE CARRITO ADD CONSTRAINT FK_Carrito_Producto
    FOREIGN KEY (IdProducto) REFERENCES PRODUCTO(IdProducto) ON DELETE CASCADE;

-- Validaciones de Integridad (Check Constraints)
ALTER TABLE PRODUCTO ADD CONSTRAINT CK_Prod_Precio CHECK (Precio >= 0);
ALTER TABLE PRODUCTO ADD CONSTRAINT CK_Prod_Stock  CHECK (Stock >= 0);
ALTER TABLE ASESORIA ADD CONSTRAINT CK_Ases_Precio CHECK (PrecioMensual >= 0);
ALTER TABLE CLIENTE ADD CONSTRAINT CK_Cliente_Email CHECK (Email LIKE '%@%.%');
ALTER TABLE DETALLE_PEDIDO ADD CONSTRAINT CK_Detalle_Cant CHECK (Cantidad > 0);
ALTER TABLE CARRITO ADD CONSTRAINT CK_Carrito_Cant CHECK (Cantidad > 0);

-- =========================================================================
-- 4. PARAMETRIZACIÓN E INSERTS INICIALES (Con Transacciones)
-- =========================================================================

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE DETALLE_PEDIDO;
TRUNCATE TABLE PEDIDO;
TRUNCATE TABLE CARRITO;
TRUNCATE TABLE ASESORIA;
TRUNCATE TABLE PRODUCTO;
TRUNCATE TABLE CATEGORIA;
TRUNCATE TABLE CLIENTE;
SET FOREIGN_KEY_CHECKS = 1;

START TRANSACTION;

INSERT INTO CATEGORIA (IdCategoria, Nombre, Descripcion) VALUES
(1, 'Suplementacion', 'Proteinas, creatinas y vitaminas de alto rendimiento.'),
(2, 'Equipamiento',   'Cinturones, straps y accesorios de gimnasio.'),
(3, 'Ropa Fitness',   'Textil deportivo de alta calidad.');

INSERT INTO PRODUCTO (IdProducto, Nombre, Descripcion, Precio, Stock, Imagen_Url, Genero, Marca, ObjetivoRecomendado, IdCategoria) VALUES
(1, 'Proteina Whey Isolate', 'Aislado de suero.',       45.99, 50,  '/assets/products/lifepro_gold_whey.png', 'unisex', 'Optimum',   'Volumen',    1),
(2, 'Creatina Monohidrato',  'Pura 100% sin sabor.',    24.50, 120, '/assets/products/lifepro_creapure.png', 'unisex', 'MyProtein', 'Volumen',    1),
(3, 'Cinturon Powerlifting', 'Cuero 10mm palanca.',     55.00, 15,  '/assets/products/sbd_belt.png', 'hombre', 'RDX',       'Fuerza',     2),
(4, 'Camiseta Oversize',     'Algodon premium negro.',  22.00, 60,  '/assets/products/gymshark_pump_cover.png', 'unisex', 'BIT-ITRON', 'Estetica',   3),
(5, 'Quemador L-Carnitina',  'Acelera perdida grasa.',  19.99, 40,  '/assets/products/amix_c4.png', 'unisex', 'Amix',      'Definicion', 1);

-- =========================================================================
-- CREDENCIALES DE PRUEBA (para desarrollo local)
-- juan@example.com   / Cliente1234!  -> rol: cliente
-- ana@example.com    / Cliente1234!  -> rol: cliente
-- admin@bitiron.com  / Admin1234!    -> rol: admin
-- =========================================================================
INSERT INTO CLIENTE (IdCliente, NombreCompleto, Email, Password_Hash, Rol, ObjetivoFitness) VALUES
(1, 'Juan Garcia', 'juan@example.com',  '$2b$10$XotUwqDbccwXtrIga5aLt.S526HQ1c01F57fh4fLWxMDEgDW7akdm', 'cliente', 'Volumen'),
(2, 'Ana Lopez',   'ana@example.com',   '$2b$10$OG3qmVe3QxRW74O2ZQkblueSF50l.ASs/7BxuzjsQLDeeluJo4dpm', 'cliente', 'Definicion'),
(3, 'Admin BIT',   'admin@bitiron.com', '$2b$10$kZk7JQsm/t16Z2ptbUC/veDvmpxKtmd2tfEJewjrEtLKLxb8DZ98C', 'admin',   NULL);

INSERT INTO ASESORIA (IdCliente, TipoPlan, PrecioMensual, FechaInicio, PagadoAlDia) VALUES
(1, 'Volumen',    49.99, '2025-04-01', TRUE),
(2, 'Definicion', 59.99, '2025-04-01', TRUE);

INSERT INTO PEDIDO (IdPedido, IdCliente, TotalPagar) VALUES (1, 1, 100.99);

INSERT INTO DETALLE_PEDIDO (IdPedido, IdProducto, Cantidad, PrecioUnitario) VALUES
(1, 1, 1, 45.99),
(1, 3, 1, 55.00);

INSERT INTO CARRITO (IdCliente, IdProducto, Cantidad) VALUES
(1, 2, 1),
(2, 5, 2);

COMMIT;

-- =========================================================================
-- 5. PROCEDIMIENTOS ALMACENADOS
-- =========================================================================

DELIMITER //

CREATE PROCEDURE sp_aplicar_descuento_marca(
    IN p_marca VARCHAR(100),
    IN p_porcentaje DECIMAL(5,2)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        INSERT INTO LOG_SISTEMA (Proceso, Descripcion) 
        VALUES ('sp_aplicar_descuento_marca', CONCAT('Error al aplicar descuento a la marca: ', p_marca));
    END;

    START TRANSACTION;

    UPDATE PRODUCTO
    SET Precio = Precio - (Precio * (p_porcentaje / 100))
    WHERE Marca = p_marca;

    INSERT INTO LOG_SISTEMA (Proceso, Descripcion) 
    VALUES ('sp_aplicar_descuento_marca', CONCAT('Éxito: Aplicado ', p_porcentaje, '% de descuento a la marca: ', p_marca));

    COMMIT;
END //

DELIMITER ;
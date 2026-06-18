CREATE DATABASE IF NOT EXISTS db_agenda_metas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_agenda_metas;

-- 1. TABLAS INDEPENDIENTES
CREATE TABLE Usuario (
    ID_Usuario INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100) NOT NULL,
    Correo VARCHAR(100) UNIQUE NOT NULL,
    Contrasena VARCHAR(255) NOT NULL,
    Estatus_Activo BOOLEAN DEFAULT TRUE,
    Fecha_Creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Categoria (
    ID_Categoria INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(50) NOT NULL,
    Color_Hex VARCHAR(7) DEFAULT '#000000'
);

CREATE TABLE Etiqueta (
    ID_Etiqueta INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(50) UNIQUE NOT NULL
);


CREATE TABLE Meta (
    ID_Meta INT PRIMARY KEY AUTO_INCREMENT,
    Creador_ID INT NOT NULL,
    Responsable_ID INT NOT NULL,
    Categoria_ID INT NOT NULL, -- Corrección: Ahora es estrictamente obligatorio
    Titulo VARCHAR(150) NOT NULL,
    Descripcion TEXT,
    Prioridad ENUM('Baja', 'Media', 'Alta', 'Critica') DEFAULT 'Media',
    Estatus ENUM('Por Hacer', 'En Progreso', 'Bloqueado', 'En QA', 'Terminado') DEFAULT 'Por Hacer',
    Porcentaje_Actual INT DEFAULT 0 CHECK (Porcentaje_Actual >= 0 AND Porcentaje_Actual <= 100),
    Fecha_Inicio DATE,
    Fecha_Limite DATE,
    Creado_En TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Actualizado_En TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (Creador_ID) REFERENCES Usuario(ID_Usuario) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (Responsable_ID) REFERENCES Usuario(ID_Usuario) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (Categoria_ID) REFERENCES Categoria(ID_Categoria) ON DELETE RESTRICT ON UPDATE CASCADE
);


CREATE TABLE Subtarea (
    ID_Subtarea INT PRIMARY KEY AUTO_INCREMENT,
    Meta_ID INT NOT NULL,
    Titulo VARCHAR(150) NOT NULL,
    Completada BOOLEAN DEFAULT FALSE,
    Fecha_Creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Meta_ID) REFERENCES Meta(ID_Meta) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Meta_Etiqueta (
    Meta_ID INT,
    Etiqueta_ID INT,
    PRIMARY KEY (Meta_ID, Etiqueta_ID),
    FOREIGN KEY (Meta_ID) REFERENCES Meta(ID_Meta) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Etiqueta_ID) REFERENCES Etiqueta(ID_Etiqueta) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE Avance (
    ID_Avance INT PRIMARY KEY AUTO_INCREMENT,
    Meta_ID INT NOT NULL,
    Usuario_ID INT NOT NULL,
    Porcentaje_Reportado INT NOT NULL CHECK (Porcentaje_Reportado >= 0 AND Porcentaje_Reportado <= 100), -- Corrección: Obligatorio
    Comentarios TEXT NOT NULL, -- Corrección: Obligatorio para evitar avances vacíos
    Evidencia_URL VARCHAR(255),
    Fecha_Registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Meta_ID) REFERENCES Meta(ID_Meta) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Usuario_ID) REFERENCES Usuario(ID_Usuario) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Datos iniciales de categorías (requeridos para crear metas)
INSERT INTO Categoria (ID_Categoria, Nombre, Color_Hex) VALUES
(1, 'Estudio', '#3B82F6'),
(2, 'Finanzas', '#10B981'),
(3, 'Salud', '#EF4444'),
(4, 'Personal', '#8B5CF6')
ON DUPLICATE KEY UPDATE Nombre = VALUES(Nombre);
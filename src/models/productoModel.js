// Model: direct SQL queries using the connection pool
const pool = require('../config/db');

const getAll = async () => {
    const [rows] = await pool.query('SELECT * FROM PRODUCTO');
    return rows;
};

const getById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM PRODUCTO WHERE IdProducto = ?', [id]);
    return rows;
};

const create = async (data) => {
    const { Nombre, Descripcion, Precio, Stock, Marca, Genero, ObjetivoRecomendado, Imagen_Url, Activo, IdCategoria } = data;
    const [result] = await pool.query(
        'INSERT INTO PRODUCTO (Nombre, Descripcion, Precio, Stock, Marca, Genero, ObjetivoRecomendado, Imagen_Url, Activo, IdCategoria, Fabricante) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [Nombre, Descripcion, Fabricante|| null, Precio, Stock || 0, Marca || null, Genero || 'Unisex', ObjetivoRecomendado || null, Imagen_Url || null, Activo !== undefined ? Activo : true, IdCategoria ]
    );
    return result;
};

const update = async (id, data) => {
    const { Nombre, Descripcion, Precio, Stock, Marca, Genero, ObjetivoRecomendado, Imagen_Url, Activo, IdCategoria, Fabricante } = data;
    const [result] = await pool.query(
        'UPDATE PRODUCTO SET Nombre = ?, Descripcion = ?, Precio = ?, Stock = ?, Marca = ?, Genero = ?, ObjetivoRecomendado = ?, Imagen_Url = ?, Activo = ?, IdCategoria = ? WHERE IdProducto = ?', 'Fabricante= ?',
        [Nombre, Descripcion, Fabricante || null, Precio, Stock || 0, Marca || null, Genero || 'Unisex', ObjetivoRecomendado || null, Imagen_Url || null, Activo !== undefined ? Activo : true, IdCategoria, id]
    );
    return result;
};

const remove = async (id) => {
    const [result] = await pool.query('DELETE FROM PRODUCTO WHERE IdProducto = ?', [id]);
    return result;
};

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
